import json
from flask import request, abort, jsonify
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.exc import UnmappedInstanceError
from app_init import app, db
from db_utils import User, Poll, Answer, Admin, PollMapping, create_poll, \
    get_matching_chat_ids, send_poll_to_chats, send_msg_to_chats, auth
from config import server_port, frontend_port
from werkzeug.security import generate_password_hash
from base64 import b64decode


@app.after_request
def add_cors_headers(response):
    response.headers.add('Access-Control-Allow-Origin', f'http://localhost:{frontend_port}')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Headers', 'Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'PUT')
    return response


@app.route('/admins', methods=['GET'])
@auth.login_required()
def admins():
    admin_names = Admin.query.with_entities(Admin.admin_name).all()
    admin_name_list = [admin.admin_name for admin in admin_names]
    return jsonify(admin_name_list)


@app.route('/admins', methods=['POST'])
@auth.login_required()
def register_admin():
    admin = Admin(admin_name=request.json['admin_name'],
                  password_hash=generate_password_hash(request.json['password']))
    try:
        db.session.add(admin)
        db.session.commit()
        return "Success"
    except IntegrityError:
        abort(409, "Admin already exists")
    except:
        abort(500, "Unknown error")


@app.route('/admins/login', methods=['POST'])
def login_admin():
    admin_name, password = b64decode(request.json['user']).decode('utf-8').split(':')
    admin = Admin.query.filter_by(admin_name=admin_name).first()
    if admin is None or not admin.verify_password(password):
        abort(409, "Wrong username or password")
    return "Logged In"


@app.route('/users', methods=['POST'])
def register_user():
    user = User(chat_id=request.form.get('chat_id'))
    try:
        db.session.add(user)
        db.session.commit()
        return "Successfully registered"
    except IntegrityError:
        abort(409, "You are already registered")


@app.route('/users/<chat_id>', methods=['DELETE'])
def remove_user(chat_id):
    try:
        user = User.query.filter_by(chat_id=chat_id).first()
        db.session.delete(user)
        db.session.commit()
        return "Successfully unregistered"
    except UnmappedInstanceError:
        return "You were already unregistered"


@app.route('/results', methods=['GET'])
@auth.login_required()
def get_results():
    polls = Poll.query.all()
    poll_list = []
    for poll in polls:
        answer_list = []
        for answer_index, answer in enumerate(poll.poll_answers):
            count = Answer.query.filter_by(poll_id=poll.poll_id, answer_index=answer_index).count()
            answer_list.append({"answer": answer, "count": count})
        poll_list.append({"question": poll.poll_question, "answers": answer_list})

    return jsonify(poll_list)


@app.route('/polls', methods=['GET'])
@auth.login_required()
def get_polls():
    polls = Poll.query.all()
    poll_list = []
    for poll in polls:
        poll_list.append({"poll_id":poll.poll_id, "question": poll.poll_question, "answers": poll.poll_answers})
    return jsonify(poll_list)


@app.route('/polls', methods=['POST'])
@auth.login_required()
def register_poll():
    poll_question, poll_answers = request.json['question'], request.json['answers']
    poll_filters = {}
    for d in request.json['poll_filters']:
        for k, v in d.items():
            key = int(k)
            if key in poll_filters and poll_filters[key] != v:
                return jsonify({"msg":"Conflicting filters were given, action cancelled", 'ok':False})
            poll_filters[key] = v
    chat_ids = get_matching_chat_ids(poll_filters)
    num_recipients = len(chat_ids)
    if num_recipients == 0:
        return jsonify({"msg":"No users would receive this poll, action cancelled", 'ok':False})
    poll_id = create_poll(poll_question, poll_answers, num_recipients)

    parameters = {
        "chat_id": "",
        "question": poll_question,
        "options": json.dumps(poll_answers),
        "is_anonymous": False
    }
    send_poll_to_chats(chat_ids=chat_ids, poll_id=poll_id, parameters=parameters)
    return jsonify({"msg":f"Sent the poll to {num_recipients} users",'ok': True})


@app.route('/polls', methods=['PUT'])
@auth.login_required()
def close_poll():
    poll_question, poll_id = request.json['question'], request.json['poll_id']
    chat_ids = Answer.query.filter_by(poll_id=poll_id).with_entities(Answer.chat_id).all()
    active_chats = User.query.with_entities(User.chat_id).all()
    chat_ids = [chat_id for chat_id in chat_ids if chat_id in active_chats]
    answers = Poll.query.filter_by(poll_id=poll_id).with_entities(Poll.poll_answers).first().poll_answers
    answer_list = []
    for answer_index, answer in enumerate(answers):
        count = Answer.query.filter_by(poll_id=poll_id, answer_index=answer_index).count()
        answer_list.append({"answer": answer, "count": count})
    total_answers = sum([answer['count'] for answer in answer_list])
    if total_answers != 0:
        msg = f"Thanks for answering the question:\n" \
              f"{poll_question}\n" \
              f"The results are:\n"
        for answer in answer_list:
            msg += f"{answer['answer']}: {100 * answer['count'] // total_answers}%\n"
        send_msg_to_chats(chat_ids, msg)
    PollMapping.query.filter_by(poll_id=poll_id).delete()
    Poll.query.filter_by(poll_id=poll_id).update(dict(active=False))
    db.session.commit()

    return ""


@app.route('/polls/status', methods=['GET'])
@auth.login_required()
def get_polls_status():
    polls = Poll.query.order_by(Poll.poll_id).all()
    poll_list = []
    for poll in polls:
        num_answered = Answer.query.filter_by(poll_id=poll.poll_id).count()
        num_pending = PollMapping.query.filter_by(poll_id=poll.poll_id).count()
        poll_list.append({'poll_id':poll.poll_id,'question':poll.poll_question, 'num_answered':num_answered,
                          'num_pending':num_pending, 'recipients':poll.recipients, 'active':poll.active})
    return jsonify(poll_list)


@app.route('/poll_answers', methods=['POST'])
def register_answer():
    try:
        telegram_poll_id, chat_id, answer_index = request.form.get('telegram_poll_id'), request.form.get('chat_id'), \
                                                  int(request.form.get('answer_index'))
        user = User.query.filter_by(chat_id=chat_id)
        if user is None:
            raise IntegrityError
        poll_mapping = PollMapping.query.filter_by(telegram_poll_id=telegram_poll_id).first()
        if poll_mapping is None:
            send_msg_to_chats([chat_id],"Sorry, your answer couldn't be recorded because this poll has been closed")
            return ""
        poll_id = poll_mapping.poll_id
        poll = Poll.query.filter_by(poll_id=poll_id).first()
        if answer_index < 0 or answer_index >= len(poll.poll_answers):
            raise IntegrityError
        answer = Answer(chat_id=chat_id, poll_id=poll_id, answer_index=answer_index)
        db.session.add(answer)
        db.session.delete(poll_mapping)
        db.session.commit()
        return ""
    except IntegrityError:
        abort(409, "Invalid answer")
    except AttributeError:
        abort(409, "Poll inactive")
    except ...:
        abort(500, "Unknown error")


@app.errorhandler(409)
def conflict(error):
    return error.description, 409


@app.errorhandler(500)
def internal_error(error):
    return error.description, 500


def setup_mock():
    # admins
    admin = Admin(admin_name="Matan", password_hash=generate_password_hash("1234"))
    db.session.add(admin)
    admin = Admin(admin_name="Ori", password_hash=generate_password_hash("1234"))
    db.session.add(admin)
    admin = Admin(admin_name="Dana", password_hash=generate_password_hash("1234"))
    db.session.add(admin)
    # polls
    poll = Poll(poll_id=0, poll_question="how you doin?", poll_answers=["ok", "fine", "*giggle*"], recipients=10)
    db.session.add(poll)
    poll = Poll(poll_id=1, poll_question="what's your favorite color?", poll_answers=["black", "white"], recipients=10)
    db.session.add(poll)
    poll = Poll(poll_id=2, poll_question="what's your favorite season?",
                poll_answers=["summer", "spring", "winter", "fall"], recipients=10)
    db.session.add(poll)
    # users
    user = User(chat_id=0)
    db.session.add(user)
    user = User(chat_id=1)
    db.session.add(user)
    user = User(chat_id=2)
    db.session.add(user)
    user = User(chat_id=3)
    db.session.add(user)
    user = User(chat_id=4)
    db.session.add(user)
    user = User(chat_id=5)
    db.session.add(user)
    user = User(chat_id=6)
    db.session.add(user)
    user = User(chat_id=7)
    db.session.add(user)
    user = User(chat_id=8)
    db.session.add(user)
    user = User(chat_id=9)
    db.session.add(user)
    db.session.commit()
    # answers
    # user 0
    answer = Answer(chat_id=0, poll_id=0, answer_index=0)
    db.session.add(answer)
    answer = Answer(chat_id=0, poll_id=1, answer_index=0)
    db.session.add(answer)
    answer = Answer(chat_id=0, poll_id=2, answer_index=0)
    db.session.add(answer)
    # user 1
    answer = Answer(chat_id=1, poll_id=0, answer_index=1)
    db.session.add(answer)
    answer = Answer(chat_id=1, poll_id=1, answer_index=0)
    db.session.add(answer)
    answer = Answer(chat_id=1, poll_id=2, answer_index=2)
    db.session.add(answer)
    # user 2
    answer = Answer(chat_id=2, poll_id=0, answer_index=2)
    db.session.add(answer)
    answer = Answer(chat_id=2, poll_id=1, answer_index=1)
    db.session.add(answer)
    answer = Answer(chat_id=2, poll_id=2, answer_index=3)
    db.session.add(answer)
    # user 3
    answer = Answer(chat_id=3, poll_id=0, answer_index=0)
    db.session.add(answer)
    answer = Answer(chat_id=3, poll_id=1, answer_index=0)
    db.session.add(answer)
    answer = Answer(chat_id=3, poll_id=2, answer_index=0)
    db.session.add(answer)
    # user 4
    answer = Answer(chat_id=4, poll_id=0, answer_index=1)
    db.session.add(answer)
    answer = Answer(chat_id=4, poll_id=1, answer_index=1)
    db.session.add(answer)
    answer = Answer(chat_id=4, poll_id=2, answer_index=3)
    db.session.add(answer)
    # user 5
    answer = Answer(chat_id=5, poll_id=0, answer_index=2)
    db.session.add(answer)
    answer = Answer(chat_id=5, poll_id=1, answer_index=1)
    db.session.add(answer)
    answer = Answer(chat_id=5, poll_id=2, answer_index=2)
    db.session.add(answer)
    # user 6
    answer = Answer(chat_id=6, poll_id=0, answer_index=1)
    db.session.add(answer)
    answer = Answer(chat_id=6, poll_id=1, answer_index=0)
    db.session.add(answer)
    answer = Answer(chat_id=6, poll_id=2, answer_index=0)
    db.session.add(answer)
    # user 7
    # answer = Answer(chat_id=7, poll_id=0, answer_index=0)
    # db.session.add(answer)
    answer = Answer(chat_id=7, poll_id=1, answer_index=1)
    db.session.add(answer)
    answer = Answer(chat_id=7, poll_id=2, answer_index=2)
    db.session.add(answer)
    # user 8
    answer = Answer(chat_id=8, poll_id=0, answer_index=1)
    db.session.add(answer)
    answer = Answer(chat_id=8, poll_id=1, answer_index=0)
    db.session.add(answer)
    answer = Answer(chat_id=8, poll_id=2, answer_index=3)
    db.session.add(answer)
    # user 9
    answer = Answer(chat_id=9, poll_id=0, answer_index=2)
    db.session.add(answer)
    answer = Answer(chat_id=9, poll_id=1, answer_index=1)
    db.session.add(answer)
    answer = Answer(chat_id=9, poll_id=2, answer_index=0)
    db.session.add(answer)
    User.query.delete()
    db.session.commit()


if __name__ == '__main__':
    db.drop_all()
    db.create_all()
    setup_mock()

    app.run(port=server_port, debug=True)


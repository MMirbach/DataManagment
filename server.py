import json
from flask import request, abort, jsonify
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.exc import UnmappedInstanceError
from app_init import app, db
from db_utils import User, Poll, Answer, Admin, PollMapping, create_poll, \
    get_matching_chat_ids, send_polls_to_chats
from config import server_port, frontend_port


@app.after_request
def add_cors_headers(response):
    response.headers.add('Access-Control-Allow-Origin', f'http://localhost:{frontend_port}')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    return response


@app.route('/admins', methods=['GET'])
def admins():
    admin_names = Admin.query.with_entities(Admin.admin_name).all()
    admin_name_list = [admin.admin_name for admin in admin_names]
    return jsonify(admin_name_list)


@app.route('/admins', methods=['POST'])
def register_admin():
    admin = Admin(admin_name=request.json['admin_name'], password=request.json['password'])
    try:
        db.session.add(admin)
        db.session.commit()
        return "Success"
    except IntegrityError:
        abort(409, "Admin already exists")
    except:
        abort(500, "Unknown error")


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


@app.route('/polls', methods=['GET'])
def get_polls():
    polls = Poll.query.all()
    poll_list = []
    for poll in polls:
        answer_list = []
        for answer_index, answer in enumerate(poll.poll_answers):
            count = Answer.query.filter_by(poll_id=poll.poll_id, answer_index=answer_index).count()
            answer_list.append({"answer": answer, "count": count})
        poll_list.append({"question": poll.poll_question, "answers": answer_list})

    return jsonify(poll_list)


@app.route('/polls', methods=['POST'])
def register_poll():
    poll_question, poll_answers = request.json['question'], request.json['answers']
    poll_id = create_poll(poll_question, poll_answers)
    poll_filters = {}
    for k, v in request.json['poll_filters'].items():
        poll_filters[int(k)] = v
    chat_ids = get_matching_chat_ids(poll_filters)

    parameters = {
        "chat_id": "",
        "question": poll_question,
        "options": json.dumps(poll_answers),
        "is_anonymous": False
    }
    send_polls_to_chats(chat_ids=chat_ids, poll_id=poll_id, parameters=parameters)
    return ""


@app.route('/poll_answers', methods=['POST'])
def register_answer():
    try:
        telegram_poll_id, chat_id, answer_index = request.form.get('telegram_poll_id'), request.form.get('chat_id'), \
                                                  int(request.form.get('answer_index'))
        user = User.query.filter_by(chat_id=chat_id)
        if user is None:
            raise IntegrityError
        poll_mapping = PollMapping.query.filter_by(telegram_poll_id=telegram_poll_id).first()
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
    return str(error), 409


@app.errorhandler(500)
def internal_error(error):
    return str(error), 500


if __name__ == '__main__':
    db.drop_all()
    db.create_all()
    # admins
    admin = Admin(admin_name="Matan", password="1234")
    db.session.add(admin)
    admin = Admin(admin_name="Ori", password="1234")
    db.session.add(admin)
    admin = Admin(admin_name="Dana", password="1234")
    db.session.add(admin)
    # polls
    poll = Poll(poll_id=0,poll_question="how you doin?", poll_answers=["ok","fine","*giggle*"])
    db.session.add(poll)
    poll = Poll(poll_id=1, poll_question="what's your favorite color?", poll_answers=["black", "white"])
    db.session.add(poll)
    poll = Poll(poll_id=2, poll_question="what's your favorite season?", poll_answers=["summer", "spring", "winter","fall"])
    db.session.add(poll)
    #users
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
    answer = Answer(chat_id=0,poll_id=0,answer_index=0)
    db.session.add(answer)
    answer = Answer(chat_id=0, poll_id=1, answer_index=0)
    db.session.add(answer)
    answer = Answer(chat_id=0, poll_id=2, answer_index=0)
    db.session.add(answer)
        # user 1
    answer = Answer(chat_id=1,poll_id=0,answer_index=1)
    db.session.add(answer)
    answer = Answer(chat_id=1, poll_id=1, answer_index=0)
    db.session.add(answer)
    answer = Answer(chat_id=1, poll_id=2, answer_index=2)
    db.session.add(answer)
        # user 2
    answer = Answer(chat_id=2,poll_id=0,answer_index=2)
    db.session.add(answer)
    answer = Answer(chat_id=2, poll_id=1, answer_index=1)
    db.session.add(answer)
    answer = Answer(chat_id=2, poll_id=2, answer_index=3)
    db.session.add(answer)
        # user 3
    answer = Answer(chat_id=3,poll_id=0,answer_index=0)
    db.session.add(answer)
    answer = Answer(chat_id=3, poll_id=1, answer_index=0)
    db.session.add(answer)
    answer = Answer(chat_id=3, poll_id=2, answer_index=1)
    db.session.add(answer)
        # user 4
    answer = Answer(chat_id=4,poll_id=0,answer_index=1)
    db.session.add(answer)
    answer = Answer(chat_id=4, poll_id=1, answer_index=1)
    db.session.add(answer)
    answer = Answer(chat_id=4, poll_id=2, answer_index=3)
    db.session.add(answer)
        # user 5
    answer = Answer(chat_id=5,poll_id=0,answer_index=2)
    db.session.add(answer)
    answer = Answer(chat_id=5, poll_id=1, answer_index=1)
    db.session.add(answer)
    answer = Answer(chat_id=5, poll_id=2, answer_index=2)
    db.session.add(answer)
        # user 6
    answer = Answer(chat_id=6,poll_id=0,answer_index=1)
    db.session.add(answer)
    answer = Answer(chat_id=6, poll_id=1, answer_index=0)
    db.session.add(answer)
    answer = Answer(chat_id=6, poll_id=2, answer_index=0)
    db.session.add(answer)
        # user 7
    answer = Answer(chat_id=7,poll_id=0,answer_index=0)
    db.session.add(answer)
    answer = Answer(chat_id=7, poll_id=1, answer_index=1)
    db.session.add(answer)
    answer = Answer(chat_id=7, poll_id=2, answer_index=2)
    db.session.add(answer)
        # user 8
    answer = Answer(chat_id=8,poll_id=0,answer_index=1)
    db.session.add(answer)
    answer = Answer(chat_id=8, poll_id=1, answer_index=0)
    db.session.add(answer)
    answer = Answer(chat_id=8, poll_id=2, answer_index=3)
    db.session.add(answer)
        # user 9
    answer = Answer(chat_id=9,poll_id=0,answer_index=2)
    db.session.add(answer)
    answer = Answer(chat_id=9, poll_id=1, answer_index=1)
    db.session.add(answer)
    answer = Answer(chat_id=9, poll_id=2, answer_index=0)
    db.session.add(answer)
    db.session.commit()
    app.run(port=server_port, debug=True)


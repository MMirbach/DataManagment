import json
from flask import request, abort
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.exc import UnmappedInstanceError
from app_init import app, db
from db_utils import User, Poll, Answer, Admin, PollMapping, create_poll, \
    get_matching_chat_ids, send_polls_to_chats


@app.route('/register/user', methods=['POST'])
def register_user():
    user = User(chat_id=request.form.get('chat_id'))
    try:
        db.session.add(user)
        db.session.commit()
        return "Successfully registered"
    except IntegrityError:
        abort(409, "You are already registered")


@app.route('/remove/<chat_id>', methods=['DELETE'])
def remove_user(chat_id):
    try:
        user = User.query.filter_by(chat_id=chat_id).first()
        db.session.delete(user)
        db.session.commit()
        return "Successfully unregistered"
    except UnmappedInstanceError:
        return "You were already unregistered"


def translate_str_to_filters_dict(poll_filters: str):
    # TODO
    return dict()


@app.route('/register/poll', methods=['POST'])
def register_poll():
    poll_question, poll_answers = request.form.get('question'), request.form.getlist('answers')
    poll_id = create_poll(poll_question, poll_answers)
    # TODO: Grab all relevant chat ids
    chat_ids = get_matching_chat_ids(translate_str_to_filters_dict(request.form.get('poll_filters')))

    parameters = {
        "chat_id": "",
        "question": poll_question,
        "options": json.dumps(poll_answers),
        "is_anonymous": False
    }
    send_polls_to_chats(chat_ids=chat_ids, poll_id=poll_id, parameters=parameters)
    # TODO: return value
    return ""


@app.route('/register/poll_answer', methods=['POST'])
def register_answer():
    try:
        telegram_poll_id, chat_id, answer_index = request.form.get('telegram_poll_id'), request.form.get('chat_id'), \
                                                  int(request.form.get('answer_index'))
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
    db.create_all()
    app.run(debug=True)


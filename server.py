from flask import request, abort
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.exc import UnmappedInstanceError
from app_init import app, db
from db_utils import (
    User,
    Poll,
    Answer,
    Admin,
    PollMapping,
    create_poll,
    get_matching_chat_ids,
    send_polls_to_chats,
)


@app.route("/register/user", methods=["POST"])
def register_user():
    user = User(chat_id=request.form.get("chat_id"))
    try:
        db.session.add(user)
        db.session.commit()
        return "Successfully registered"
    except IntegrityError:
        abort(409, "You are already registered")


@app.route("/remove/<chat_id>", methods=["DELETE"])
def remove_user(chat_id):
    try:
        user = User.query.filter_by(chat_id=chat_id).first()
        db.session.delete(user)
        db.session.commit()
        return "Successfully unregistered"
    except UnmappedInstanceError:
        return "You were already unregistered"


@app.errorhandler(409)
def conflict(error):
    return str(error), 409


@app.errorhandler(500)
def internal_error(error):
    return str(error), 500


if __name__ == "__main__":
    db.create_all()
    app.run(debug=True)

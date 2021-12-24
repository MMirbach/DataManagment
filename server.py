import requests, json
from flask import Flask, request, abort
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, String, Integer, ARRAY, ForeignKey
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.exc import UnmappedInstanceError
from env import API_KEY

send_poll_url = f"https://api.telegram.org/bot{API_KEY}/sendPoll"

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://MJ:Pogo97531@localhost/polls'
db = SQLAlchemy(app)


class Admin(db.Model):
    __tablename__ = 'admins'
    admin_name = Column(String(64), primary_key=True)
    password = Column(String(64))

    def __repr__(self):
        return f"Name: {self.admin_name}"


class User(db.Model):
    __tablename__ = 'users'
    chat_id = Column(String(64), primary_key=True)
    username = Column(String(64))

    def __repr__(self):
        return f"Name: {self.username}, chat: {self.chat_id}"


class Poll(db.Model):
    __tablename__ = 'polls'
    poll_id = Column(String(64), primary_key=True)
    poll_question = Column(String(300), nullable=False)
    poll_answers = Column(ARRAY(String(100)),nullable=False)

    def __repr__(self):
        return f"Id: {self.poll_id}, question: {self.poll_question}, answers: {self.poll_answers}"


class Answer(db.Model):
    __tablename__ = 'answers'
    chat = Column(String(64), ForeignKey('users.chat_id', ondelete='CASCADE'), primary_key=True)
    poll = Column(String(64), ForeignKey('polls.poll_id', ondelete='CASCADE'), primary_key=True)
    answer_index = Column(Integer)

    def __repr__(self):
        return f"Chat: {self.chat}, poll: {self.poll}, answer index: {self.answer_index}"


@app.route('/register', methods=['POST'])
def register_user():
    user = User(chat_id=request.form.get('chat_id'), username=request.form.get('username'))
    try:
        db.session.add(user)
        db.session.commit()
        return f"Successfully registered {request.form.get('username')}"
    except IntegrityError:
        abort(409)


@app.route('/remove/<chat_id>/<username>', methods=['DELETE'])
def remove_user(chat_id, username):
    try:
        user = User.query.filter_by(chat_id=chat_id, username=username).first()
        db.session.delete(user)
        db.session.commit()
        return f"Successfully removed {username}"
    except UnmappedInstanceError:
        # this exception is received even if this chat has no user
        return f"{username} isn't your username"


@app.route('/<chat_id>', methods=['GET'])
def send_poll(chat_id):
    parameters = {
        "chat_id" : chat_id,
        "question" : "What's up?",
        "options" : json.dumps(["good", "ok", "bad"])
    }
    requests.get(send_poll_url, data=parameters)

    return ""


@app.errorhandler(409)
def user_already_exists(error):
    return "You already have a user", 409


if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)


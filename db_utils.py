from sqlalchemy import Column, String, Integer, ARRAY, ForeignKey
from app_init import db
from sqlalchemy import func
import requests
from config import send_poll_url


class Admin(db.Model):
    __tablename__ = 'admins'
    admin_name = Column(String(64), primary_key=True)
    password = Column(String(64), nullable=False)

    def __repr__(self):
        return f"Name: {self.admin_name}"


class User(db.Model):
    __tablename__ = 'users'
    chat_id = Column(String(64), primary_key=True)

    def __repr__(self):
        return f"Chat: {self.chat_id}"


class Poll(db.Model):
    __tablename__ = 'polls'
    poll_id = Column(Integer, primary_key=True)
    poll_question = Column(String(300), nullable=False)
    poll_answers = Column(ARRAY(String(100)),nullable=False)

    def __repr__(self):
        return f"Id: {self.poll_id}, question: {self.poll_question}, answers: {self.poll_answers}"


class Answer(db.Model):
    __tablename__ = 'answers'
    chat_id = Column(String(64), primary_key=True)
    poll_id = Column(Integer, ForeignKey('polls.poll_id', ondelete='CASCADE'), primary_key=True)
    answer_index = Column(Integer, nullable=False)

    def __repr__(self):
        return f"Chat: {self.chat_id}, poll: {self.poll_id}, answer index: {self.answer_index}"


class PollMapping(db.Model):
    __tablename__ = 'pollmapping'
    telegram_poll_id = Column(String(64), primary_key=True)
    poll_id = Column(Integer, ForeignKey('polls.poll_id', ondelete='CASCADE'), nullable=False)

    def __repr__(self):
        return f"Poll ID: {self.poll_id}, Telegram Poll ID: {self.telegram_poll_id}"


def create_poll(poll_question, poll_answers):
    while True:
        try:
            poll_id = db.session.query(func.max(Poll.poll_id)).scalar()
            if poll_id is None:
                poll_id = 0
            else:
                poll_id += 1
            new_poll = Poll(poll_id=poll_id, poll_question=poll_question, poll_answers=poll_answers)
            db.session.add(new_poll)
            db.session.commit()
            return poll_id
        except Exception:
            db.session.rollback()
            continue


def get_matching_chat_ids(poll_filters: dict):
    if len(poll_filters) == 0:
        return [user.chat_id for user in User.query.all()]
    chat_ids = list()
    ran_first_time = False
    for k, v in poll_filters.items():
        if ran_first_time and len(chat_ids) == 0:
            break
        else:
            answer_results = Answer.query.filter_by(poll_id=k, answer_index=v).all()
            if not ran_first_time:
                ran_first_time = True
                chat_ids = [answer.chat_id for answer in answer_results]
            else:
                answer_results = Answer.query.filter_by(poll_id=k, answer_index=v).all()
                chat_ids = [answer.chat_id for answer in answer_results if answer.chat_id in chat_ids]
    return chat_ids


def send_polls_to_chats(chat_ids: list, poll_id: int, parameters: dict):
    for chat_id in chat_ids:
        parameters['chat_id'] = chat_id
        resp = requests.get(send_poll_url, data=parameters)
        telegram_poll_id = resp.json()['result']['poll']['id']
        db.session.add(PollMapping(telegram_poll_id=telegram_poll_id, poll_id=poll_id))
        try:
            db.session.commit()
        except Exception as e:
            print(f"Poll mapping {poll_id}:{telegram_poll_id} was not inserted into the database. This was probably "
                  f"caused by a synchronization error.\nError: {e}")
            continue

from sqlalchemy import Column, String, Integer, ARRAY, ForeignKey
from app_init import db


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

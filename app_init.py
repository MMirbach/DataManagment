from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://MJ:Pogo97531@localhost/polls'
db = SQLAlchemy(app)


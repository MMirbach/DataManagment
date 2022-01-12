from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import postgres_connection_string

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = postgres_connection_string
db = SQLAlchemy(app)

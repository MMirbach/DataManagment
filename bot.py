from telegram.ext import *
from telegram.update import Update
from utils import API_KEY
import requests


def start_handler(update: Update, context: CallbackContext):
    update.message.reply_text(f"Hello {update.message.chat.first_name}")
    update.message.reply_text("Welcome to smart polling.\nPlease choose one of the options:")
    update.message.reply_text("/register - Register to start answering polls via telegram\n"
                              "\n"
                              "/remove - To stop getting polls queries\n"
                              "\n"
                              "/start - Use start anytime see get this menu again")


def error(update: Update, context: CallbackContext, errorString: str):
    update.message.reply_text(errorString)


def respond(update: Update, context: CallbackContext, httpResponse: requests.Response):
    update.message.reply_text(httpResponse.text)


def execute_register_user(update: Update, context: CallbackContext):
    data = { 'chat_id': update.message.chat_id }
    return requests.post(f"http://localhost:5000/register/user", data=data)


def register_user_handler(update: Update, context: CallbackContext):
    resp = execute_register_user(update, context)
    respond(update, context, resp)


def execute_remove_user(update: Update, context: CallbackContext):
    return requests.delete(f"http://localhost:5000/remove/{update.message.chat_id}")


def remove_user_handler(update: Update, context: CallbackContext):
    resp = execute_remove_user(update, context)
    respond(update, context, resp)


def register_answer_handler(update: Update, context: CallbackContext):
    data = {
        'chat_id': update.poll_answer.user.id,
        'telegram_poll_id': update.poll_answer.poll_id,
        'answer_index': update.poll_answer.option_ids[0]
    }
    requests.post(f"http://localhost:5000/register/poll_answer", data=data)


def send_poll(update: Update, context: CallbackContext):
    question, answers = ' '.join(context.args).split('?')
    question += '?'
    answers = answers.split(',')
    data = {
        'chat_id' : update.message.chat_id,
        'question' : question,
        'answers' : answers
    }
    requests.post(f"http://localhost:5000/register/poll", data=data)


# TODO: check async responses

if __name__ == '__main__':
    updater = Updater(API_KEY)
    dp = updater.dispatcher
    dp.add_handler(CommandHandler("start", start_handler))
    dp.add_handler(CommandHandler("register", register_user_handler))
    dp.add_handler(CommandHandler("remove", remove_user_handler))
    dp.add_handler(CommandHandler("send", send_poll))
    dp.add_handler(PollAnswerHandler(register_answer_handler))
    updater.start_polling()
    updater.idle()



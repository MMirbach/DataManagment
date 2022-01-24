from telegram.ext import *
from telegram.update import Update
import requests, json
from config import server_port, bot_key


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
    return requests.post(f"http://localhost:{server_port}/users", data=data)


def register_user_handler(update: Update, context: CallbackContext):
    resp = execute_register_user(update, context)
    respond(update, context, resp)


def execute_remove_user(update: Update, context: CallbackContext):
    return requests.delete(f"http://localhost:{server_port}/users/{update.message.chat_id}")


def remove_user_handler(update: Update, context: CallbackContext):
    resp = execute_remove_user(update, context)
    respond(update, context, resp)


def register_answer_handler(update: Update, context: CallbackContext):
    data = {
        'chat_id': update.poll_answer.user.id,
        'telegram_poll_id': update.poll_answer.poll_id,
        'answer_index': update.poll_answer.option_ids[0]
    }
    resp = requests.post(f"http://localhost:{server_port}/poll_answers", data=data)


if __name__ == '__main__':
    updater = Updater(bot_key)
    dp = updater.dispatcher
    dp.add_handler(CommandHandler("start", start_handler, run_async=True))
    dp.add_handler(CommandHandler("register", register_user_handler, run_async=True))
    dp.add_handler(CommandHandler("remove", remove_user_handler, run_async=True))
    dp.add_handler(PollAnswerHandler(register_answer_handler))

    updater.start_polling()
    updater.idle()



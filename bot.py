from telegram.ext import *
from telegram.update import Update
from env import API_KEY
import requests


def start_handler(update: Update, context: CallbackContext):
    update.message.reply_text(f"Hello {update.message.chat.first_name}")
    update.message.reply_text("Welcome to smart polling.\nPlease choose one of the options:")
    update.message.reply_text("/register <user-name> - Register to start answering polls via telegram\n"
                              "<user-name> in smart polling system\n"
                              "\n"
                              "/remove <user-name> - To stop getting polls queries\n"
                              "<user-name> in smart polling system\n"
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


if __name__ == '__main__':
    updater = Updater(API_KEY)
    dp = updater.dispatcher
    dp.add_handler(CommandHandler("start", start_handler, run_async=True))
    dp.add_handler(CommandHandler("register", register_user_handler, run_async=True))
    dp.add_handler(CommandHandler("remove", remove_user_handler, run_async=True))
    updater.start_polling()
    updater.idle()



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

def validate_user_name(update: Update, context: CallbackContext):
    if len(context.args) == 0:
        error(update, context, "Username cannot be empty")
        return False
    elif len(context.args) > 1:
        error(update, context, "Username cannot contain white spaces")
        return False
    return True

def validate_register_user(update: Update, context: CallbackContext):
    if not validate_user_name(update, context):
        return False
    return True


def execute_register_user(update: Update, context: CallbackContext):
    data = {
        'chat_id': update.message.chat_id,
        'username': context.args[0]
    }
    return requests.post(f"http://localhost:5000/register", data=data)


def register_user_handler(update: Update, context: CallbackContext):
    if not validate_register_user(update, context):
        return
    resp = execute_register_user(update, context)
    respond(update, context, resp)


def validate_remove_user(update: Update, context: CallbackContext):
    if not validate_user_name(update, context):
        return False
    return True


def execute_remove_user(update: Update, context: CallbackContext):
    return requests.delete(f"http://localhost:5000/remove/{update.message.chat_id}/{context.args[0]}")


def remove_user_handler(update: Update, context: CallbackContext):
    if not validate_remove_user(update, context):
        return
    resp = execute_remove_user(update, context)
    respond(update, context, resp)


def printAnswer(update: Update, context: CallbackContext):
    # print(update.poll_answer.option_ids[0])  # answer index
    # print(update.poll_answer.poll_id)  # poll id
    pass


# TODO: check async responses

def main():
    updater = Updater(API_KEY)
    dp = updater.dispatcher
    dp.add_handler(CommandHandler("start", start_handler))
    dp.add_handler(CommandHandler("register", register_user_handler))
    dp.add_handler(CommandHandler("remove", remove_user_handler))
    dp.add_handler(PollAnswerHandler(printAnswer))
    updater.start_polling()
    updater.idle()


main()


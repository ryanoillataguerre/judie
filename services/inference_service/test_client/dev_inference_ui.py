import argparse
import os
import sys
import uuid
from typing import Dict, Optional, Tuple

import grpc
from grpc_health.v1 import health_pb2_grpc
from grpc_health.v1 import health_pb2
import prisma
from decouple import config
from dotenv import load_dotenv

from prisma_app_client import prisma_manager
from server.inference_service_pb2_grpc import InferenceServiceStub
from server.inference_service_pb2 import ChatDetails, ReturnConnectedCheck


# Load the .env file
load_dotenv()


class ExitCommand(Exception):   
    """Custom exception class to catch a user entering an exit command."""
    pass


def check_health():
    """Run a health check against the inference service."""
    try:
        with grpc.insecure_channel("localhost:443") as channel:
            stub = health_pb2_grpc.HealthStub(channel)
            response = stub.Check(
                health_pb2.HealthCheckRequest(service="grpc.health.v1.Health")
            )
            if response.status != health_pb2.HealthCheckResponse.SERVING:
                return False

        with grpc.insecure_channel("localhost:443") as channel:
            stub = InferenceServiceStub(channel)
            response = stub.serverConnectionCheck(
                ReturnConnectedCheck(returnCheck=True)
            )
            if not response:
                return False
        
        return True

    except grpc.RpcError:
        print("Waiting for services to start ...")
        return False


def display_help() -> None:
    """Display the commands used in the dev ui."""
    print(
        "A couple commands you can use during the session:\n"
        "* \help        : Displays this message again\n"
        "* \exit        : Exists the session and calls `docker-compose down`\n"
        "* \\restart     : Restarts a new session\n"
        "* \chat_id     : Displays the current chat_id\n"
        "* \\user_id     : Displays the current user_id\n"
        "* \subject     : Displays the current subject\n\n"

        "To navigate around tmux (assuming no custom tmux settings):\n"
        "* ctrl, b, <arrow key>     : To move between panes\n"
        "* ctrl, b, [               : To enter scroll mode to use arrows and pgUp/pgDn and mouse\n"
        "* q                        : To exit scroll mode\n"
        "* exit                     : To exit tmux windows\n"
        "* \q                       : To exit the postgreSQL console\n"
        "* ctrl+c                   : To exit the inference service\n\n"

        "If you used the --windows option then different workspaces are in separate tmux windows\n"
        "* ctrl, b, 0               : To access the terminal\n"
        "* ctrl, b, 1               : To access the logs from the inference service\n"
        "* ctrl, b, 2               : To access the postgreSQL console\n"
        "* ctrl, b, 3               : To access this chat window\n\n"
    )


def get_input(prompt, default="") -> str:
    """Get input from the user and exit if the \exit command is entered.

    Args:
        prompt  : The prompt shown to the user.
        default : A default value if the user presses Enter.
    Return:
        The user text
    """
    user_input = input(prompt) or default
    if user_input.strip() == "\\exit":
        raise ExitCommand
    else:
        return user_input.strip()


def get_user_chat_info() -> Tuple[str, str, str, str]:
    print("To start, enter in the user name, user role, and subject for the chat session.\n")

    try:
        user = get_input(f"User name (Press Enter for {config('USER')}): ", config("USER"))
        role = get_input("User role (Press Enter for STUDENT): ", "STUDENT")
        subject = get_input("Subject (Press Enter for no subject): ", "")
        chat_id = get_input("Existing chat_id? (Press Enter for a new chat): ", "")
    except ExitCommand:
        sys.exit()
    return user.replace(" ", "_"), role, subject, chat_id


def get_or_create_user(
    email: str,
    data: Dict[str, str],
    app_db: Optional[prisma.Prisma] = None
) -> Optional[prisma.models.User]:
    """Retrieve a user if they exist using the user's email and create a new user if not found.

    Args:
        email   : The user's email
        data    : The data dictionary to use when creating the user. Must contain at the minimum
                  the following keys:
                        - email
                        - receivePromotions
        app_db  : An optional prisma db
    Return:
        The user object that was retrieved or created
    """
    # Connect to DB via Prisma
    if not app_db:
        app_db = prisma.Prisma()
    app_db.connect()

    # Check for existing user
    user = app_db.user.find_first(
        where={
            "email": email,
        },
    )

    # Return user if found, otherwise create an entry for the user
    if user is not None:
        return user
    else:
        new_user = app_db.user.create(data=data)
        return new_user


def get_or_create_chat(
    data: Optional[Dict[str, str]] = None,
    chat_id: Optional[str] = None,
    app_db: Optional[prisma.Prisma] = None
) -> prisma.models.Chat:
    """Add a row to the chat table.

    Args:
        data    : The row data that contains at the minimum the keys:
                    - userId
        chat_id : The chat_id to retrieve if one already exists
        app_db  : An optional prisma db
    Return:
        The chat object that was retrieved or created
    """

    # Get existing chat if chat_id != None or create a new chat if not
    if chat_id is not None:
        chat = prisma_manager.get_chat(chat_id)
        return chat
    else:
        if not app_db:
            app_db = prisma.Prisma()
        app_db.connect()

        new_chat = app_db.chat.create(data=data)
        return new_chat


def create_message(
    data: Dict[str, str],
    app_db: Optional[prisma.Prisma] = None
) -> Optional[prisma.models.Message]:
    """Add a row to the messages table.

    Args:
        data    : The row data that contains at the minimum the keys:
                    - content
                    - readableContent
                    - type
                    - chat_id
        app_db  : An optional prisma db
    Return:
        The message object that was retrieved or created
    """
    # Connect to DB via Prisma
    if not app_db:
        app_db = prisma.Prisma()
    app_db.connect()

    new_message = app_db.message.create(data=data)
    return new_message


def initialize_session() -> Tuple[prisma.models.User, prisma.models.Chat]:
    """Print welcome message, help commands, and initialize user and chat.

    Return:
        user object, chat object
    """
    # Initialize the session 
    os.system('cls||clear')
    print(
        "Welcome! Use this interface during development to interact with the inference service.\n"
        "You can start typing as you would in the Judie chat window.\n"
    )
    display_help()

    # Get user_id, role, and subject (enter to use system username and no subject)
    user_name, role, subject, chat_id = get_user_chat_info()
   
    # Get or create user
    email = f"{user_name}@devsession.com"
    data = {
        "email": email,
        "firstName": user_name,
        "role": role,
        "receivePromotions": False,
    }
    user = get_or_create_user(email, data)

    # Get or create chat
    if chat_id:
        chat = get_or_create_chat(chat_id=chat_id)
    else:
        data = {
            "userId": user.id,
            "subject": subject,
        }
        chat = get_or_create_chat(data=data)

    return user, chat
 
 
def get_chat_response(chat_id: str) -> None:
    """Send user message to inference service and print results.

    Args:
        chat_id : The ID for the ongoing chat.
    """
    with grpc.insecure_channel("localhost:443") as channel:
        stub = InferenceServiceStub(channel)
        response = stub.getChatResponse(ChatDetails(chat_id=chat_id))

        first = True
        for part in response:
            if first:
                print(f"\nMeta Data:\n{part.chatMetaData}\n\nJudie:")
                first = False
            print(str(part.responsePart), end="", flush=True)


def run_chat(user: prisma.models.User, chat: prisma.models.Chat) -> None:
    """Run a chat between the user and inference service.

    Args:
        user    : The user Prisma object
        chat    : The chat Prisma object
    """
    user_name = user.firstName if user.firstName is not None else "USER"

    in_session = True
    while in_session:
        # Get message from user
        message = input(f"\n\n{user_name}: ") or ""

        # Check for commands in user input
        if not message:
            continue
        elif message == "\help":
            display_welcome()
            continue
        elif message == "\exit":
            return
        elif message == "\\restart":
            initialize_session()
            continue
        elif message == "\chat_id":
            print(chat.id)
            continue
        elif message == "\\user_id":
            print(user.id)
            continue
        elif message == "\subject":
            print(chat.subject)
            continue

        # Add message to DB
        data = {
            "content": message,
            "readableContent": message,
            "type": "USER",
            "chatId": chat.id,
        }
        _ = create_message(data=data)

        # Send to inference service
        get_chat_response(chat.id)


def main():
    """Main method for module."""
    user, chat = initialize_session()
    run_chat(user, chat)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        '--health-check', action='store_true', help='Run a health check and exit'
    )
    args = parser.parse_args()

    if args.health_check:
        _ = check_health()
        sys.exit(0)
    else:
        main()


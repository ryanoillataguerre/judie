import argparse
import asyncio
import os
import uuid
from typing import Dict, Optional, Tuple

import grpc
#import health_pb2_grpc
#import health_pb2
import prisma
import psycopg2
from decouple import config
from dotenv import load_dotenv

from prisma_app_client import prisma_manager
from server.inference_service_pb2_grpc import InferenceServiceStub
from server.inference_service_pb2 import ChatDetails


# Load the .env file
load_dotenv()


def display_welcome() -> None:
    print(
        "Welcome! Use this interface during development to interact with the inference service.\n"
        "You can start typing as you would in the Judie chat window.\n\n"
        "A couple commands you can use during the session:\n"
        "* \\restart     : Restarts a new session\n"
        "* \exit        : Exists the session and calls `docker-compose down`\n\n"
        "* \chat_id     : Displays the current chat_id\n"

        "To start, enter in the user name, user role, and subject for the chat session.\n"
    )


def get_user_chat_info() -> None:
    user = input(f"User name (Press Enter for {config('USER')}): ") or config("USER")
    role = input(f"User role (Press Enter for STUDENT): ") or "STUDENT"
    subject = input(f"Subject (Press Enter for no subject): ") or ""
    chat_id = input(f"Existing chat_id? (Press Enter for a new chat): ") or ""
    return user, role, subject, chat_id


def get_or_create_user(
    email: str,
    data: Dict[str, str],
    app_db: Optional[prisma.Prisma] = None
) -> Optional[prisma.models.User]:
    """
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
) -> Optional[prisma.models.User]:
    """Add a row to the messages table.

    Args:
        data    : The row data that contains at the minimum the keys:
                    - content
                    - readableContent
                    - type
                    - chat_id
    """
    # Connect to DB via Prisma
    if not app_db:
        app_db = prisma.Prisma()
    app_db.connect()

    new_message = app_db.message.create(data=data)
    return new_message


def initialize_session() -> Tuple[prisma.models.User, prisma.models.Chat]:
    """

    """
    # Initialize the session 
    os.system('cls||clear')
    display_welcome()

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
 
 
def get_chat_response(chat_id: str):
    """
    """
    with grpc.insecure_channel("localhost:443") as channel:
        stub = InferenceServiceStub(channel)
        response = stub.getChatResponse(ChatDetails(chat_id=chat_id))

        first = True
        for part in response:
            if first:
                print("Meta Data:")
                print(part.chatMetaData)
                first = False
            print(str(part.responsePart), end="", flush=True)


def run_chat(user_name: str, chat_id: str):
    """
    """
    in_session = True
    while in_session:
        # Get message from user
        message = input(f"{user_name}: ") or ""

        # Check for commands in user input
        if not message:
            continue
        elif message == "\exit":
            return
        elif message == "\chat_id":
            print(chat_id)
            continue
        elif message == "\\restart":
            initialize_session()
            continue

        # Add message to DB
        data = {
            "content": message,
            "readableContent": message,
            "type": "USER",
            "chatId": chat_id,
        }
        _ = create_message(data=data)

        # Send to inference service
        get_chat_response(chat_id)


def main():
    user, chat = initialize_session()
    run_chat(user.firstName, chat.id)


if __name__ == "__main__":
    main()


'''
def check_health():
    try:
        with grpc.insecure_channel("localhost:443") as channel:
            stub = health_pb2_grpc.HealthStub(channel)
            response = stub.Check(
                health_pb2.HealthCheckRequest(service="grpc.health.v1.Health")
            )
            if response.status != health_pb2.HealthCheckResponse.SERVING:
                return False

        with grpc.insecure_channel("localhost:443") as channel:
            stub = inference_service_pb2_grpc.InferenceServiceStub(channel)
            response = stub.serverConnectionCheck(
                inference_service_pb2.ReturnConnectedCheck(returnCheck=True)
            )
            if not response:
                return False
        
        return True

    except grpc.RpcError as e:
        print(f"Health check failed: {e}")
        return False

    #if not check_health():


def get_postgres_cursor(parameters: dict):
    """Connects to a PostgreSQL database and returns a connection object.

    Return:
        A psycopg2.Cursor object, or None if the cursor could not be created.
    """
    try:
        database_url = config('DATABASE_URL')
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor()
    except psycopg2.OperationalError:
        return None

    return cursor

'''


from typing import Optional
import prisma
from typing import List, Dict
from collections import deque
from enum import Enum
from inference_service.server.judie_data import History, ChatTurn, Role


class UserType(Enum):
    STUDENT = "USER"
    PARENT = "PARENT"
    TEACHER = "TEACHER"
    ADMINISTRATOR = "ADMINISTRATOR"
    JUDIE = "JUDIE"


def get_messages(
    chat_id: str, app_db: Optional[prisma.Prisma] = None
) -> List[prisma.models.Message]:
    if not app_db:
        app_db = prisma.Prisma()

    app_db.connect()

    chats = app_db.message.find_many(
        where={
            "chatId": chat_id,
        },
    )

    chats = sorted(chats, key=lambda x: x.createdAt)
    return chats


def get_chat_history(
    chat_id: str,
    app_db: Optional[prisma.Prisma] = None,
) -> History:
    messages = get_messages(chat_id=chat_id, app_db=app_db)

    hist = History()

    for chat in messages:
        if chat.type == "USER":
            turn = ChatTurn(role=Role.USER, content=chat.content)
        elif chat.type == "BOT":
            turn = ChatTurn(role=Role.ASSISTANT, content=chat.content)
        else:
            continue

        hist.add_turn(turn)
    return hist


def get_chat_openai_fmt(
    chat_id: str,
    app_db: Optional[prisma.Prisma] = None,
    length_limit: Optional[int] = None,
) -> List[Dict]:
    chats = get_messages(chat_id=chat_id, app_db=app_db)

    chats_fmtd = deque()

    if length_limit is not None:
        running_length = 0

    for chat in reversed(chats):
        if length_limit is not None:
            print(chat.content)
            running_length += len(chat.content)
            if running_length > length_limit:
                break

        if chat.type == "USER":
            role = "user"
        elif chat.type == "BOT":
            role = "assistant"
        else:
            continue

        chats_fmtd.appendleft({"role": role, "content": chat.content})
    return list(chats_fmtd)


def get_chat_local():
    """
    Method to mock the DB storage functionality with local memory for local testing
    """
    raise NotImplementedError


def get_chat(
    chat_id: str, app_db: Optional[prisma.Prisma] = None
) -> prisma.models.Chat:
    if not app_db:
        app_db = prisma.Prisma()

    app_db.connect()

    selected_chat = app_db.chat.find_first(
        where={
            "id": chat_id,
        },
    )

    return selected_chat


def get_subject_from_db(chat_id: str, app_db: Optional[prisma.Prisma] = None) -> str:
    selected_chat = get_chat(chat_id, app_db)

    return selected_chat.subject


def get_subject_from_chat(chat: prisma.models.Chat) -> str:
    return str(chat.subject)


def get_assignment_from_db(
    chat_id: str, app_db: Optional[prisma.Prisma] = None
) -> Optional[str]:
    if not app_db:
        app_db = prisma.Prisma()

    app_db.connect()

    assignment = app_db.chatassignment.find_first(
        where={
            "chatId": chat_id,
        },
    )

    if assignment is not None:
        return assignment.text
    return None


def get_special_context_from_chat(chat: prisma.models.Chat) -> List[str]:
    context = []
    for tag in chat.tags:
        if tag == "assignment":
            special_content = get_assignment_from_db(chat_id=chat.id)
        else:
            continue
        context.append(special_content)
    return context


def get_user_from_db(
    user_id: str, app_db: Optional[prisma.Prisma] = None
) -> Optional[prisma.models.User]:
    if not app_db:
        app_db = prisma.Prisma()

    app_db.connect()

    user = app_db.user.find_first(
        where={
            "id": user_id,
        },
    )

    if user is not None:
        return user
    return None


def get_user_type_from_user(user: prisma.models.User) -> str:
    return user.role

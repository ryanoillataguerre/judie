from typing import Optional
import prisma
from typing import List, Dict
from collections import deque


def get_chat(
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


def get_chat_openai_fmt(
    chat_id: str,
    app_db: Optional[prisma.Prisma] = None,
    length_limit: Optional[int] = None,
) -> List[Dict]:
    chats = get_chat(chat_id=chat_id, app_db=app_db)

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
    raise NotImplementedError


def get_subject(chat_id: str, app_db: Optional[prisma.Prisma] = None):
    if not app_db:
        app_db = prisma.Prisma()

    app_db.connect()

    selected_chat = app_db.chat.find_first(
        where={
            "id": chat_id,
        },
    )
    return selected_chat.subject

from typing import Optional
from prisma import Prisma


def get_chat(chat_id: str, app_db: Optional[Prisma] = None):
    if not app_db:
        app_db = Prisma()

    await app_db.connect()
    chats = await app_db.chat.find_many(
        where={
            "id": chat_id,
        },
    )
    return chats

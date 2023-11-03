from typing import Optional
import prisma
from typing import List, Dict
from collections import deque
from inference_service.server.judie_data import (
    History,
    ChatTurn,
    MessageRole,
    UserType,
    AccountPurpose,
    GradeYear,
)


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
            turn = ChatTurn(role=MessageRole.USER, content=chat.content)
        elif chat.type == "BOT":
            turn = ChatTurn(role=MessageRole.ASSISTANT, content=chat.content)
        else:
            continue

        hist.add_turn(turn)
    return hist


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
        print(f"TAG: {tag}")
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


def get_user_type_from_user(user: prisma.models.User) -> UserType:
    return UserType[user.role]


def get_user_profile_from_db(
    user_id: str, app_db: Optional[prisma.Prisma] = None
) -> Optional[prisma.models.UserProfile]:
    if not app_db:
        app_db = prisma.Prisma()

    app_db.connect()

    user_profile = app_db.userprofile.find_first(
        where={
            "userId": user_id,
        },
    )

    if user_profile is not None:
        return user_profile
    return None


def get_grade_from_profile(
    user_profile: Optional[prisma.models.UserProfile],
) -> Optional[GradeYear]:
    if user_profile is not None and user_profile.gradeYear is not None:
        return GradeYear[user_profile.gradeYear]
    return None


def get_purpose_from_profile(
    user_profile: prisma.models.UserProfile,
) -> Optional[AccountPurpose]:
    if user_profile is not None and user_profile.purpose is not None:
        return AccountPurpose[user_profile.purpose]
    return None


def get_country_from_profile(
    user_profile: Optional[prisma.models.UserProfile],
) -> Optional[str]:
    if user_profile is not None and user_profile.country is not None:
        return user_profile.country
    return None


def get_state_from_profile(
    user_profile: Optional[prisma.models.UserProfile],
) -> Optional[str]:
    if user_profile is not None and user_profile.state is not None:
        return user_profile.state
    return None


def get_subjects_from_profile(
    user_profile: Optional[prisma.models.UserProfile],
) -> Optional[List[str]]:
    if user_profile is not None:
        return [subject for subject in user_profile.subjects]
    return None

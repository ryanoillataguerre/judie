from dotenv import load_dotenv
import pytest
from inference_service.prisma_app_client import prisma_manager
from inference_service.test_client.test_chats_config import (
    LOCAL_ID_1,
    LOCAL_ID_1,
    LOCAL_ID_3,
    LOCAL_USER_ID,
)
from inference_service.server.judie_data import GradeYear, AccountPurpose


@pytest.fixture
def env_setup():
    load_dotenv()


def test_get_chat(env_setup):
    chats = prisma_manager.get_messages(chat_id=LOCAL_ID_1)
    for i in chats:
        print(i)
        print()


def test_get_chat_openai(env_setup):
    chats = prisma_manager.get_chat_openai_fmt(chat_id=LOCAL_ID_1)
    print(chats)
    assert len(chats) == 13
    assert chats[0]["role"] == "user"
    assert "Raphael" in chats[1]["content"]


def test_get_chat_length_limit(env_setup):
    chats = prisma_manager.get_chat_openai_fmt(chat_id=LOCAL_ID_1, length_limit=2000)
    print(chats)
    assert len(chats) == 7
    assert chats[0]["role"] == "user"


def test_get_subject_db(env_setup):
    subject = prisma_manager.get_subject_from_db(chat_id=LOCAL_ID_1)
    assert subject == "AP Art History"


def test_get_subject_chat(env_setup):
    chat = prisma_manager.get_chat(chat_id=LOCAL_ID_1)
    subject = prisma_manager.get_subject_from_chat(chat)
    assert subject == "AP Art History"


def test_get_special_context(env_setup):
    chat = prisma_manager.get_chat(chat_id=LOCAL_ID_3)
    context = prisma_manager.get_special_context_from_chat(chat)
    print(context)
    assert "This is a closed book exam." in context[0]

    chat = prisma_manager.get_chat(chat_id=LOCAL_ID_1)
    context = prisma_manager.get_special_context_from_chat(chat)
    print(context)
    assert context == []


def test_get_user(env_setup):
    user = prisma_manager.get_user_from_db(LOCAL_USER_ID)
    print(user)
    print(user.role)
    assert user.role == "ADMINISTRATOR"


def test_get_user_profile_from_db(env_setup):
    user_profile = prisma_manager.get_user_profile_from_db(LOCAL_USER_ID)
    print(user_profile)
    assert user_profile.gradeYear == "EIGHTH"


def test_grade_from_profile(env_setup):
    user_profile = prisma_manager.get_user_profile_from_db(LOCAL_USER_ID)
    grade = prisma_manager.get_grade_from_profile(user_profile)
    assert grade == GradeYear.EIGHTH


def test_purpose_from_profile(env_setup):
    user_profile = prisma_manager.get_user_profile_from_db(LOCAL_USER_ID)
    purpose = prisma_manager.get_purpose_from_profile(user_profile)
    assert purpose == AccountPurpose.CLASSES

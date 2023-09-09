from dotenv import load_dotenv
import pytest
from inference_service.prisma_app_client import prisma_manager
from inference_service.test_client.test_chats_config import TEST_CHAT_ID_1, LOCAL_ID_1


@pytest.fixture
def env_setup():
    load_dotenv()


def test_get_chat(env_setup):
    chats = prisma_manager.get_messages(chat_id=TEST_CHAT_ID_1)
    for i in chats:
        print(i)
        print()


def test_get_chat_openai(env_setup):
    chats = prisma_manager.get_chat_openai_fmt(chat_id=TEST_CHAT_ID_1)
    print(chats)
    assert len(chats) == 2
    assert chats[0]["role"] == "user"
    assert "Gregory XIII" in chats[1]["content"]


def test_get_chat_length_limit(env_setup):
    chats = prisma_manager.get_chat_openai_fmt(
        chat_id=TEST_CHAT_ID_1, length_limit=2735
    )
    print(chats)
    assert len(chats) == 1
    assert chats[0]["role"] == "assistant"


def test_get_subject_db(env_setup):
    subject = prisma_manager.get_subject_from_db(chat_id=TEST_CHAT_ID_1)
    assert subject == "AP Art History"


def test_get_subject_chat(env_setup):
    chat = prisma_manager.get_chat(chat_id=TEST_CHAT_ID_1)
    subject = prisma_manager.get_subject_from_chat(chat)
    assert subject == "AP Art History"


def test_get_special_context(env_setup):
    chat = prisma_manager.get_chat(chat_id=LOCAL_ID_1)
    context = prisma_manager.get_special_context_from_chat(chat)
    print(context)
    assert "This is a closed book exam." in context[0]

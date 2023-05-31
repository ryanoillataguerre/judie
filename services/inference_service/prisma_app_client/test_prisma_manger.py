import prisma
from dotenv import load_dotenv
import pytest
from inference_service.prisma_app_client import prisma_manager
from inference_service.test_client.test_chats_config import TEST_CHAT_ID_1


@pytest.fixture
def env_setup():
    load_dotenv()


def test_get_chat(env_setup):
    chats = prisma_manager.get_chat(chat_id=TEST_CHAT_ID_1)
    for i in chats:
        print(i)
        print()


def test_get_chat_openai(env_setup):
    chats = prisma_manager.get_chat_openai_fmt(chat_id=TEST_CHAT_ID_1)
    assert len(chats) == 2
    assert chats[0]["role"] == "user"
    assert "Gregory XIII" in chats[1]["content"]
    print(chats)

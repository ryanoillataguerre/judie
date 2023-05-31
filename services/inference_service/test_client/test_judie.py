from inference_service.server import judie
import pytest
import openai
from dotenv import load_dotenv
import os
import pinecone
from inference_service.test_client.test_chats_config import TEST_CHAT_ID_2


@pytest.fixture
def env_setup():
    load_dotenv()
    pinecone.init(
        api_key=os.getenv("PINECONE_API_KEY"),
        environment=os.getenv("PINECONE_ENVIRONMENT"),
    )
    openai.api_key = os.getenv("OPENAI_API_KEY")


def test_judie_stream(env_setup):
    response = judie.yield_judie_response(TEST_CHAT_ID_2, subject="Microeconomics")
    for i in response:
        print(i)

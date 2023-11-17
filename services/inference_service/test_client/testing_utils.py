import pytest
from dotenv import load_dotenv
import pinecone
import openai
import os


@pytest.fixture
def env_setup_fixture():
    load_dotenv()
    pinecone.init(
        api_key=os.getenv("PINECONE_API_KEY"),
        environment=os.getenv("PINECONE_ENVIRONMENT"),
    )
    openai.api_key = os.getenv("OPENAI_API_KEY")


def env_setup_cmd():
    load_dotenv()
    pinecone.init(
        api_key=os.getenv("PINECONE_API_KEY"),
        environment=os.getenv("PINECONE_ENVIRONMENT"),
    )
    openai.api_key = os.getenv("OPENAI_API_KEY")

import pytest
from dotenv import load_dotenv
import pinecone
import openai
import os


@pytest.fixture
def env_setup():
    load_dotenv()
    pinecone.init(
        api_key=os.getenv("PINECONE_API_KEY"),
        environment=os.getenv("PINECONE_ENVIRONMENT"),
    )
    openai.api_key = os.getenv("OPENAI_API_KEY")

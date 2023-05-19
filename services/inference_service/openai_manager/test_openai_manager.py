import pytest
import openai
from dotenv import load_dotenv
import os
from inference_service.openai_manager import openai_manager


@pytest.fixture
def env_setup():
    load_dotenv()

    openai.api_key = os.getenv("OPENAI_API_KEY")


def test_openai_stream(env_setup):
    test_messages = [{"role": "user", "content": "What is photosynthesis?"}]

    response = openai_manager.get_gpt_response(messages=test_messages)
    i = 0
    for chunk in response:
        print(chunk)
        i += 1
    # empty responses could still have a start and end token
    assert i > 2

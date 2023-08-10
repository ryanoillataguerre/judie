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

    response = openai_manager.get_gpt_response(
        messages=test_messages, openai_config=openai_manager.OpenAiConfig(stream=True)
    )
    i = 0
    for chunk in response:
        print(chunk)
        i += 1
    # empty responses could still have a start and end token
    assert i > 2


def test_math_expressions(env_setup):
    expression = "Can you help me find out what the 2nd derivative of sinx cosx is?"
    response = openai_manager.identify_math_exp(expression)
    print(response)
    assert "sinx" in expression

    expression = "Prove that 4*5 = 12+8"
    response = openai_manager.identify_math_exp(expression)
    print(response)
    assert "12" in expression

    expression = "I don't know how to solve for 5 plus 5"
    response = openai_manager.identify_math_exp(expression)
    print(response)
    assert "5" in response

    expression = "The sky is purple today"
    response = openai_manager.identify_math_exp(expression)
    print(response)
    assert response == "none"

    expression = "I want to learn about long division"
    response = openai_manager.identify_math_exp(expression)
    print(response)
    assert response == "none"


def test_comprehension(env_setup):
    assert False

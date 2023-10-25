import pytest
import openai
from dotenv import load_dotenv
import os
from inference_service.openai_manager import openai_manager
import inference_service.server.judie_data
import asyncio


@pytest.fixture
def env_setup():
    load_dotenv()

    openai.api_key = os.getenv("OPENAI_API_KEY")


def test_openai_stream(env_setup):
    test_messages = [{"role": "user", "content": "What is photosynthesis?"}]

    response = openai_manager.get_gpt_response_stream(
        messages=test_messages, openai_config=openai_manager.OpenAiConfig()
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
    history = inference_service.server.judie_data.History()
    history.add_turn(
        inference_service.server.judie_data.ChatTurn(
            role=inference_service.server.judie_data.Role.USER,
            content="Sick content here",
        )
    )
    sesh = inference_service.server.judie_data.SessionConfig(
        history=history, chat_id="1", subject=""
    )
    comp_score = asyncio.run(openai_manager.comprehension_score(session_config=sesh))

    assert comp_score in [i for i in range(11)]


def test_chat_sensitive_content_bio(env_setup):
    history = inference_service.server.judie_data.History()
    history.add_turn(
        inference_service.server.judie_data.ChatTurn(
            role=inference_service.server.judie_data.Role.USER,
            content="Hi I want to learn about sexual reproduction",
        )
    )
    sesh = inference_service.server.judie_data.SessionConfig(
        history=history, chat_id="1", subject="AP Biology"
    )
    sensitive = openai_manager.check_for_sensitive_content(session_config=sesh)
    assert sensitive is None


def test_chat_sensitive_content_date(env_setup):
    history = inference_service.server.judie_data.History()
    history.add_turn(
        inference_service.server.judie_data.ChatTurn(
            role=inference_service.server.judie_data.Role.USER,
            content="Hi I want to take you on a date Judie",
        )
    )
    sesh = inference_service.server.judie_data.SessionConfig(
        history=history, chat_id="1", subject="AP Biology"
    )
    sensitive = openai_manager.check_for_sensitive_content(session_config=sesh)
    assert sensitive is not None


def test_moderation(env_setup):
    history = inference_service.server.judie_data.History()
    history.add_turn(
        inference_service.server.judie_data.ChatTurn(
            role=inference_service.server.judie_data.Role.USER,
            content="Hi I want to learn about sexual reproduction",
        )
    )
    sesh = inference_service.server.judie_data.SessionConfig(
        history=history, chat_id="1", subject="AP Biology"
    )
    moderation = openai_manager.check_moderation_policy(session_config=sesh)
    assert moderation == []


def test_moderation_curse(env_setup):
    history = inference_service.server.judie_data.History()
    history.add_turn(
        inference_service.server.judie_data.ChatTurn(
            role=inference_service.server.judie_data.Role.USER,
            content="Hey. Fuck You",
        )
    )
    sesh = inference_service.server.judie_data.SessionConfig(
        history=history, chat_id="1", subject="AP Biology"
    )
    moderation = openai_manager.check_moderation_policy(session_config=sesh)
    assert len(moderation) > 0


def test_completion_single(env_setup):
    test_messages = [{"role": "user", "content": "What is photosynthesis?"}]

    response = openai_manager.get_gpt_response_single(
        messages=test_messages, openai_config=openai_manager.OpenAiConfig()
    )

    assert "synth" in response


@pytest.mark.asyncio
async def test_async_completion(env_setup):
    test_messages = [{"role": "user", "content": "What is photosynthesis?"}]

    response = await openai_manager.get_gpt_response_async(
        messages=test_messages, openai_config=openai_manager.OpenAiConfig()
    )

    assert "synth" in response

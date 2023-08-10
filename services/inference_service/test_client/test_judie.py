import inference_service.server.judie_data
from inference_service.server import judie
from inference_service.test_client.test_chats_config import TEST_CHAT_ID_2
from inference_service.test_client.testing_utils import env_setup


def test_judie_stream(env_setup):
    response = judie.yield_judie_response(
        TEST_CHAT_ID_2,
        config=inference_service.server.judie_data.SessionConfig(
            subject="Microeconomics"
        ),
    )
    for i in response:
        print(i)


def test_create_chat_turn(env_setup):
    turn = inference_service.server.judie_data.ChatTurn(
        role=inference_service.server.judie_data.Role.USER, content="Sick content here"
    )

    assert turn.content == "Sick content here"
    assert turn.role == inference_service.server.judie_data.Role.USER


def test_create_history(env_setup):
    history = inference_service.server.judie_data.History()
    history.add_turn(
        inference_service.server.judie_data.ChatTurn(
            role=inference_service.server.judie_data.Role.USER,
            content="Sick content here",
        )
    )

    assert history.get_last_user_message() == "Sick content here"

    history.add_turn(
        inference_service.server.judie_data.ChatTurn(
            role=inference_service.server.judie_data.Role.ASSISTANT,
            content="Wow that was sick content",
        )
    )

    assert history.get_last_user_message() == "Sick content here"

    history.add_turn(
        inference_service.server.judie_data.ChatTurn(
            role=inference_service.server.judie_data.Role.USER,
            content="This is even sicker",
        )
    )

    assert history.get_last_user_message() == "This is even sicker"


def test_history_openai_fmt(env_setup):
    history = inference_service.server.judie_data.History()
    history.add_turn(
        inference_service.server.judie_data.ChatTurn(
            role=inference_service.server.judie_data.Role.USER,
            content="Sick content here",
        )
    )

    assert history.get_openai_format() == [
        {"role": "user", "content": "Sick content here"}
    ]

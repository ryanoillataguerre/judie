from inference_service.server import judie_data
from inference_service.server import judie
from inference_service.test_client.test_chats_config import TEST_CHAT_ID_2
from inference_service.test_client.testing_utils import env_setup


def test_get_config(env_setup):
    sesh = judie.grab_chat_config(TEST_CHAT_ID_2)
    assert sesh.subject == "AP Microeconomics"
    assert "core" in sesh.history.get_last_user_message()


def test_judie_stream(env_setup):
    sesh = judie.grab_chat_config(TEST_CHAT_ID_2)

    response = judie.yield_judie_response(TEST_CHAT_ID_2, config=sesh)
    for i in response:
        print(i)


def test_create_chat_turn(env_setup):
    turn = judie_data.ChatTurn(role=judie_data.Role.USER, content="Sick content here")

    assert turn.content == "Sick content here"
    assert turn.role == judie_data.Role.USER


def test_create_history(env_setup):
    history = judie_data.History()
    history.add_turn(
        judie_data.ChatTurn(
            role=judie_data.Role.USER,
            content="Sick content here",
        )
    )

    assert history.get_last_user_message() == "Sick content here"

    history.add_turn(
        judie_data.ChatTurn(
            role=judie_data.Role.ASSISTANT,
            content="Wow that was sick content",
        )
    )

    assert history.get_last_user_message() == "Sick content here"

    history.add_turn(
        judie_data.ChatTurn(
            role=judie_data.Role.USER,
            content="This is even sicker",
        )
    )

    assert history.get_last_user_message() == "This is even sicker"


def test_history_openai_fmt(env_setup):
    history = judie_data.History()
    history.add_turn(
        judie_data.ChatTurn(
            role=judie_data.Role.USER,
            content="Sick content here",
        )
    )

    assert history.get_openai_format() == [
        {"role": "user", "content": "Sick content here"}
    ]


def test_history_openai_fmt_len_limit(env_setup):
    history = judie_data.History()
    history.add_turn(
        judie_data.ChatTurn(
            role=judie_data.Role.USER,
            content="Sick content here",
        )
    )

    assert history.get_openai_format(length_limit=2) == []
    assert history.get_openai_format(length_limit=100) == [
        {"role": "user", "content": "Sick content here"}
    ]

    history.add_turn(
        judie_data.ChatTurn(
            role=judie_data.Role.ASSISTANT,
            content="Wow that was sick content",
        )
    )

    assert history.get_openai_format(length_limit=26) == [
        {"role": "assistant", "content": "Wow that was sick content"}
    ]


def test_session_config(env_setup):
    history = judie_data.History()
    history.add_turn(
        judie_data.ChatTurn(
            role=judie_data.Role.USER,
            content="Sick content here",
        )
    )

    sesh_config = judie_data.SessionConfig(history=history, subject="Microeconomics")

    assert sesh_config.subject == "Microeconomics"
    assert sesh_config.history.get_last_user_message() == "Sick content here"

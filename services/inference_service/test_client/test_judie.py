from inference_service.server import judie
from inference_service.test_client.test_chats_config import TEST_CHAT_ID_2


def test_judie_stream(env_setup):
    response = judie.yield_judie_response(
        TEST_CHAT_ID_2, config=judie.SessionConfig(subject="Microeconomics")
    )
    for i in response:
        print(i)

import grpc
from inference_service.server import inference_service_pb2_grpc, inference_service_pb2
from inference_service.test_client.test_chats_config import (
    TEST_CHAT_ID_1,
    TEST_CHAT_ID_2,
)


if __name__ == "__main__":
    with grpc.insecure_channel("localhost:443") as channel:
        stub = inference_service_pb2_grpc.InferenceServiceStub(channel)

        print("Connection health check")
        response = stub.ServerConnectionCheck(
            inference_service_pb2.ReturnConnectedCheck(returnCheck=True)
        )
        print(response)
        print()

        print("Chat response stream")
        response = stub.GetChatResponse(
            inference_service_pb2.ChatDetails(
                chat_id=TEST_CHAT_ID_2, subject="Microeconomics"
            )
        )
        for part in response:
            print(str(part.responsePart), end="", flush=True)

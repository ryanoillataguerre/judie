import grpc
from inference_service.server import inference_service_pb2_grpc, inference_service_pb2
from inference_service.test_client.test_chats_config import (
    TEST_CHAT_ID_2,
)
from grpc_health.v1 import health_pb2, health_pb2_grpc

if __name__ == "__main__":
    with grpc.insecure_channel("localhost:8080") as channel:
        stub = health_pb2_grpc.HealthStub(channel)
        print("Liveliness health check")
        response = stub.Check(health_pb2.HealthCheckRequest(service=""))
        print(response)

    with grpc.insecure_channel("localhost:443") as channel:
        stub = inference_service_pb2_grpc.InferenceServiceStub(channel)

        print("Inference connection health check")
        response = stub.ServerConnectionCheck(
            inference_service_pb2.ReturnConnectedCheck(returnCheck=True)
        )
        print(response)
        print()

        print("Chat response stream")
        response = stub.GetChatResponse(
            inference_service_pb2.ChatDetails(chat_id=TEST_CHAT_ID_2)
        )
        for part in response:
            print(str(part.responsePart), end="", flush=True)

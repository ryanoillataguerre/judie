import grpc
import sys
from inference_service.server import inference_service_pb2_grpc, inference_service_pb2


if __name__ == "__main__":
    print(sys.path)
    with grpc.insecure_channel("localhost:443") as channel:
        stub = inference_service_pb2_grpc.InferenceServiceStub(channel)
        response = stub.GetChatResponse(
            inference_service_pb2.Conversation(
                turn=[
                    inference_service_pb2.ConvTurn(sender="student", message="hey"),
                    inference_service_pb2.ConvTurn(sender="tutor", message="hey"),
                    inference_service_pb2.ConvTurn(
                        sender="student", message="teach me"
                    ),
                ]
            )
        )
        print("Client received: " + response.response)

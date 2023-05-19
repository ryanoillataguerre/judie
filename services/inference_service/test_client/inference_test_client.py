import grpc
import sys
from inference_service.server import inference_service_pb2_grpc, inference_service_pb2


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
            inference_service_pb2.Conversation(
                turns=[
                    inference_service_pb2.ConvTurn(sender="student", message="hey"),
                    inference_service_pb2.ConvTurn(sender="tutor", message="hey"),
                    inference_service_pb2.ConvTurn(
                        sender="student", message="teach me"
                    ),
                ]
            )
        )
        for part in response:
            print("Client received: " + str(part.responsePart))

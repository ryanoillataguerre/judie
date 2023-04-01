import grpc
import sys
from inference_service.server import inference_service_pb2_grpc, inference_service_pb2


if __name__ == "__main__":
    print(sys.path)
    with grpc.insecure_channel('localhost:443') as channel:
        stub = inference_service_pb2_grpc.InferenceServiceStub(channel)
        response = stub.GetChatResponse(
            inference_service_pb2.Conversation(
                query="Tell me a story",
                turn=[inference_service_pb2.ConvTurn(student_query="hey", tutor_response="hey"),
                      inference_service_pb2.ConvTurn(student_query="teach me", tutor_response="I will")]))
        print("Client received: " + response.response)

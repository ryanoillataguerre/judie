import grpc
from services.inference_service.server import inference_service_pb2_grpc, inference_service_pb2


def chat():
    pass


if __name__ == "__main__":
    with grpc.insecure_channel('localhost:50051') as channel:
        stub = inference_service_pb2_grpc.InferenceServiceStub(channel)
        response = stub.GetChatResponse(
            inference_service_pb2.Conversation(
                query="Tell me a story",
                turn=[inference_service_pb2.ConvTurn(student_query="hey", tutor_response="hey"),
                      inference_service_pb2.ConvTurn(student_query="teach me", tutor_response="I will")]))
        print("Client received: " + response.response)
    chat()

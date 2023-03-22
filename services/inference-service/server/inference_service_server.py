import inference_service_pb2
import os
import grpc
from concurrent import futures


class InferenceService(inference_service_pb2.InferenceServiceServicer):
    """
    Class to define the behavior of the Inference Service
    """

    def GetChatResponse(self, request, context) -> None:

        raise NotImplementedError


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    server.add_insecure_port(f':{os.getenv("PORT")}')

    service.add_ProjectSvcServicer_to_server(api.API(), server)

    server.start()
    logging.info(f'Inference GRPC server running at on port {os.getenv("PORT")}')
    server.wait_for_termination()


if __name__ == '__main':
    serve()

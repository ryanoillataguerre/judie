import inference_service_pb2
import inference_service_pb2_grpc
import os
import grpc
from concurrent import futures
import logging
import sys

class InferenceServiceServicer(inference_service_pb2_grpc.InferenceServiceServicer):
    """
    Class to define the behavior of the Inference Service
    """

    def GetChatResponse(self, request, context) -> None:
        print(request.Conversation.turn[-1])


def serve():
    grpc_port = os.getenv("GRPC_PORT")
    logger.info(f'Attempting grpc connection on port: {grpc_port}',)
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    server.add_insecure_port(f'[::]:{grpc_port}')

    inference_service_pb2_grpc.add_InferenceServiceServicer_to_server(InferenceServiceServicer,
                                                                      server)

    server.start()
    logger.info(f'Inference GRPC server running at on port {grpc_port}')
    server.wait_for_termination(timeout=3)
    logger.info('Server ded')


if __name__ == '__main__':
    # set up logging
    logger = logging.getLogger("inference_logger")

    logger.setLevel(logging.DEBUG)

    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(logging.DEBUG)

    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(filename)s:%(funcName)s - %(message)s')

    handler.setFormatter(formatter)
    logger.addHandler(handler)

    logger.info('Running serve()')
    serve()

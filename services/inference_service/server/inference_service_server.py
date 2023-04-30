import inference_service_pb2
import inference_service_pb2_grpc
import os
import grpc
from concurrent import futures
from inference_service.logging_utils import logging_utils


class InferenceServiceServicer(inference_service_pb2_grpc.InferenceServiceServicer):
    """
    Class to define the behavior of the Inference Service
    """

    def GetChatResponse(self, request, context) -> None:
        for part in ["Do.", "Or do not.", "There is no try."]:
            yield inference_service_pb2.TutorResponse(responsePart=part)

    def ServerConnectionCheck(self, request, context):
        return inference_service_pb2.ConnectedCheckResonse(connected=True)


def serve():
    grpc_port = os.getenv("GRPC_PORT")
    logger.info(
        f"Attempting grpc connection on port: {grpc_port}",
    )
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    server.add_insecure_port(f"[::]:{grpc_port}")

    inference_service_pb2_grpc.add_InferenceServiceServicer_to_server(
        InferenceServiceServicer(), server
    )

    server.start()
    logger.info(f"Inference GRPC server running at on port {grpc_port}")
    server.wait_for_termination()
    logger.info("Server ded")


if __name__ == "__main__":
    # set up logging
    logger = logging_utils.setup_logger()

    logger.info("Running serve()")
    serve()

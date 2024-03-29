import inference_service_pb2
import inference_service_pb2_grpc
from grpc_health.v1 import health
from grpc_health.v1 import health_pb2
from grpc_health.v1 import health_pb2_grpc
import os
import grpc
import pinecone
import openai
from concurrent import futures
from inference_service.logging_utils import logging_utils
from inference_service.server import judie
from inference_service.server.judie import generate_chat_metadata
from inference_service.openai_manager.openai_manager import check_moderation_policy


def setup_env():
    pinecone.init(
        api_key=os.getenv("PINECONE_API_KEY"),
        environment=os.getenv("PINECONE_ENVIRONMENT"),
    )
    openai.api_key = os.getenv("OPENAI_API_KEY")
    grpc_port = os.getenv("GRPC_PORT")
    return grpc_port


class InferenceServiceServicer(inference_service_pb2_grpc.InferenceServiceServicer):
    """
    Class to define the behavior of the Inference Service
    """

    def getChatResponse(self, request, context):
        logger.info(f"Get chat response request: \n{request}")

        chat_id = request.chat_id

        try:
            chat_config = judie.grab_chat_config(chat_id)
            logger.debug(f"Grabbed config for chat {chat_id}")
        except Exception as e:
            logger.error(f"Issue pulling session config for chat: {chat_id}")
            logger.error(e)
            return None

        moderated_chat = False
        try:
            moderation_violations = check_moderation_policy(chat_config)
            if len(moderation_violations) > 0:
                moderated_chat = True
        except Exception as e:
            logger.error(f"Error checking content moderation for chat: {chat_id}")
            logger.error(e)

        try:
            meta_data = generate_chat_metadata(chat_config)
        except Exception as e:
            logger.error(f"Issue generating meta data for chat: {chat_id}")
            logger.error(e)

            meta_data = {}

        if moderated_chat:
            response = judie.moderation_response(moderation_violations)
        else:
            response = judie.yield_judie_response(config=chat_config)

        first_message = True
        for part in response:
            if first_message:
                yield inference_service_pb2.TutorResponse(
                    responsePart=part, chatMetaData=meta_data
                )
                first_message = False
            yield inference_service_pb2.TutorResponse(
                responsePart=part, chatMetaData={}
            )

    def serverConnectionCheck(self, request, context):
        logger.info(f"Server connection check request: {request}")
        return inference_service_pb2.ConnectedCheckResponse(connected=True)


def serve():
    grpc_port = setup_env()

    # Setup Chat Response Server
    logger.info(
        f"Attempting grpc connection on port: {grpc_port}",
    )

    inference_server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    inference_server.add_insecure_port(f"0.0.0.0:{grpc_port}")

    inference_service_pb2_grpc.add_InferenceServiceServicer_to_server(
        InferenceServiceServicer(), inference_server
    )

    # Setup health check server
    logger.info(
        f"Attempting health check connection on port: {grpc_port}",
    )

    health_servicer = health.HealthServicer(experimental_non_blocking=True)
    health_servicer.set("", health_pb2.HealthCheckResponse.SERVING)
    health_servicer.set("grpc.health.v1.Health", health_pb2.HealthCheckResponse.SERVING)
    health_pb2_grpc.add_HealthServicer_to_server(health_servicer, inference_server)

    inference_server.start()
    logger.info(f"Inference gRPC server running on port {grpc_port}")
    logger.info(f"Health check gRPC server running on port {grpc_port}")

    # Run both services on single server indefinitely
    inference_server.wait_for_termination()
    logger.info("Server ded")


if __name__ == "__main__":
    # set up logging
    logger = logging_utils.setup_logger()

    logger.info("Running serve()")
    serve()

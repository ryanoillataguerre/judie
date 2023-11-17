import pinecone
import argparse
import logging
from inference_service.logging_utils import logging_utils
from inference_service.test_client.testing_utils import env_setup_cmd

logging_utils.setup_logger("cmd_logger")
logger = logging.getLogger("cmd_logger")


def remove_all_vectors_from_namespace(index_name: str, namespace: str) -> None:
    logger.info(
        f"Removing all vectors in index: {index_name} in namespace: {namespace}..."
    )
    index = pinecone.Index(index_name)
    index.delete(ids=[], delete_all=True, namespace=namespace)
    logger.info("Vectors successfully cleared")


if __name__ == "__main__":
    env_setup_cmd()
    parser = argparse.ArgumentParser(
        prog="ContextAdminCmd",
        description="This command allows for easy running of Pinecone administration commands like bulk removals of vectors.",
    )

    parser.add_argument("-r", "--remove_from_namespace", default=False, type=bool)
    parser.add_argument("-i", "--index_name", default="knowledge-base-v2")
    parser.add_argument("-n", "--namespace")

    args = parser.parse_args()

    if args.remove_from_namespace:
        if args.namespace:
            remove_all_vectors_from_namespace(
                index_name=args.index_name, namespace=args.namespace
            )
        else:
            raise ValueError(
                "--namespace argument required when running removal. Please provide."
            )

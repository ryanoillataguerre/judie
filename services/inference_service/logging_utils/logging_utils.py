import logging
import sys


def setup_logger():
    logger = logging.getLogger("inference_logger")

    logger.setLevel(logging.DEBUG)

    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(logging.DEBUG)

    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(filename)s:%(funcName)s - %(message)s"
    )

    handler.setFormatter(formatter)
    logger.addHandler(handler)
    return logger

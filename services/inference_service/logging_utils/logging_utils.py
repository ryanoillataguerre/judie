import logging
import sys
import os


def setup_logger(name="inference_logger"):
    logger = logging.getLogger(name)

    log_level_env = os.getenv("LOGGING_LEVEL")

    if log_level_env == "debug":
        log_level = logging.DEBUG
    else:
        log_level = logging.INFO

    logger.setLevel(log_level)

    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(log_level)

    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(filename)s:%(funcName)s - %(message)s"
    )

    handler.setFormatter(formatter)
    logger.addHandler(handler)
    return logger

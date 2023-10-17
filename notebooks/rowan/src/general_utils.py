"""Utility class for general functions.

This class is used for functions that are shared across multiple utility classes.

Date: 2023-10-16 (modified 2023-10-16)
"""
import json
import logging
import yaml
from typing import Any, Dict, Optional


DEFAULT_MSG_FORMAT = (
    "%(asctime)s - %(name)s - %(levelname)s - %(filename)s:%(funcName)s - %(message)s"
)


def get_logger(
    name: str = "logger",
    level: int = logging.INFO,
    msg_format: str = DEFAULT_MSG_FORMAT,
    log_filename: Optional[str] = None,
    write_mode: str = "a",
    log_to_console: bool = True
) -> logging.Logger:
    """
    Configure a basic logger.

    Args:
        name            : The name of the logger
        level           : The default level of the logger (will log everything of a higher level)
        msg_format      : The format for the log messages
        log_filename    : Optional filename if writing logs to a file
        write_mode      : The write mode to use if writing to a file
        log_to_console  : Whether to log to the console
    Returns:
        Logger object
    """
    # Create or retrieve a logger
    logger = logging.getLogger(name)
    logger.setLevel(level)

    # Create a formatter
    formatter = logging.Formatter(msg_format)

    # Check if a FileHandler and StreamHandler already exists
    file_handler_exists = any(
        isinstance(handler, logging.FileHandler) and handler.baseFilename == log_filename
        for handler in logger.handlers
    )
    stream_handler_exists = any(
        isinstance(handler, logging.StreamHandler) for handler in logger.handlers
    )

    # Create FileHandler if required
    if log_filename and not file_handler_exists:
        file_handler = logging.FileHandler(log_filename, mode=write_mode)
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)

    # Check if a StreamHandler already exists
    if log_to_console and not stream_handler_exists:
        console_handler = logging.StreamHandler()
        console_handler.setFormatter(formatter)
        logger.addHandler(console_handler)

    return logger


def load_params(config_file: str) -> Dict[str, Any]:
    """Load the dictionary of parameters.

    Args:
        config_file : File with project configs to load
    Return:
        params_dc   : Dictionary of configs loaded from config_file (or None if exception)
    """
    logger = get_logger(name=__name__)
    try:
        with open(config_file, "rt") as f:
            params_dc = yaml.load(f, Loader=yaml.FullLoader)
        logger.info(
            f"params retrived from {config_file}:\n{json.dumps(params_dc, indent=4, default=str)}"
        )
        return params_dc
    except Exception as e:
        logger.exception(f"Error loading params from {config_file}: {e}")
        return None


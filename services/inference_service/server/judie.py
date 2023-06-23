import prisma
from inference_service.prompts import prompt_generator
from inference_service.openai_manager import openai_manager
from inference_service.prisma_app_client import prisma_manager
from typing import Optional, Iterator, Dict
import logging
from dataclasses import dataclass

logger = logging.getLogger("inference_logger")


@dataclass
class SessionConfig:
    subject: Optional[str] = None


def yield_judie_response(
    chat_id: Optional[str], config: SessionConfig, app_db: Optional[prisma.Prisma] = None
) -> Optional[Iterator[str]]:
    """
    Wrapper around main logic for streaming based Judie Chat.
    :param chat_id: uuid string for chat objects in app DB
    :param config: config object for relevant session data like subject or user type
    :param app_db: Prisma manager for app DB connection
    :return: Generator of response chunk strings
    """
    history = prisma_manager.get_chat_openai_fmt(chat_id=chat_id)

    if history[-1]["role"] == "user":
        sys_prompt = prompt_generator.generate_question_answer_prompt(
            question=history[-1]["content"], subject_modifier=config.subject
        )
        logger.info(f"Full prompt: {sys_prompt}")

        full_messages = openai_manager.concat_sys_and_messages_openai(
            sys_prompt=sys_prompt, messages=history
        )
        logger.info(f"Full messages: \n{full_messages}")
        openai_response = openai_manager.get_gpt_response(full_messages)

        for response_chunk in openai_response:
            yield response_chunk
        logger.debug("Done yielding chunks")
    else:
        logger.info("No response because last message type was not user's.")
        yield None
        return None


def grab_chat_config(chat_id: Optional[str]) -> SessionConfig:
    return SessionConfig(subject=prisma_manager.get_subject(chat_id=chat_id))

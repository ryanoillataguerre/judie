import prisma
from inference_service.prompts import prompt_generator
from inference_service.openai_manager import openai_manager
from inference_service.prisma_app_client import prisma_manager
from typing import Optional, Iterator, Dict
import logging
from inference_service.server.judie_data import SessionConfig

logger = logging.getLogger("inference_logger")

# 32,000 chars ~= 8,000 tokens
TOTAL_PROMPT_LIMIT = 31000


def yield_judie_response(
    config: SessionConfig,
) -> Optional[Iterator[str]]:
    """
    Wrapper around main logic for streaming based Judie Chat.
    :param config: config object for relevant session data like subject or user type
    :return: Generator of response chunk strings
    """
    history = config.history

    if history.last_msg_is_user():
        sys_prompt = prompt_generator.generate_question_answer_prompt(
            question=history.get_last_user_message(), subject=config.subject
        )
        logger.info(f"Full prompt: {sys_prompt}")

        full_messages = openai_manager.concat_sys_and_messages_openai(
            sys_prompt=sys_prompt,
            messages=history.get_openai_format(
                length_limit=TOTAL_PROMPT_LIMIT - len(sys_prompt)
            ),
        )
        logger.info(f"Full messages: \n{full_messages}")
        openai_config = openai_manager.OpenAiConfig(stream=True)
        openai_response = openai_manager.get_gpt_response(
            full_messages, openai_config=openai_config
        )

        for response_chunk in openai_response:
            yield response_chunk
        logger.debug("Done yielding chunks")
    else:
        logger.info("No response because last message type was not user's.")
        yield None
        return None


def grab_chat_config(chat_id: Optional[str]) -> SessionConfig:
    return SessionConfig(
        history=prisma_manager.get_chat_history(chat_id=chat_id),
        subject=prisma_manager.get_subject(chat_id=chat_id),
    )


def generate_chat_metadata(chat_config: SessionConfig) -> Dict[str, str]:
    """
    Generate full chat metadata to pass back to the caller
    :param chat_config: config for the chat
    :return: dict of str metadata identifiers and values
    """
    return {"comprehension": str(openai_manager.comprehension_score(chat_config))}

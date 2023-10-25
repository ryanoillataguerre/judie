import prisma
from inference_service.prompts import prompt_generator
from inference_service.openai_manager import openai_manager
from inference_service.prisma_app_client import prisma_manager
from typing import Optional, Iterator, Dict, List
import logging
from inference_service.server.judie_data import SessionConfig
import asyncio

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
            question=history.get_last_user_message(),
            subject=config.subject,
            extra_context=config.special_context,
        )
        logger.info(f"Full prompt: {sys_prompt}")

        full_messages = openai_manager.concat_sys_and_messages_openai(
            sys_prompt=sys_prompt,
            messages=history.get_openai_format(
                length_limit=TOTAL_PROMPT_LIMIT - len(sys_prompt)
            ),
        )
        logger.info(f"Full messages: \n{full_messages}")
        openai_config = openai_manager.OpenAiConfig()
        openai_response = openai_manager.get_gpt_response_stream(
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
    chat_obj = prisma_manager.get_chat(chat_id)
    user_obj = prisma_manager.get_user_from_db(chat_obj.userId)

    return SessionConfig(
        history=prisma_manager.get_chat_history(chat_id=chat_id),
        subject=prisma_manager.get_subject_from_chat(chat_obj),
        special_context=prisma_manager.get_special_context_from_chat(chat_obj),
        user_type=prisma_manager.get_user_type_from_user(user_obj),
    )


def generate_chat_metadata(chat_config: SessionConfig) -> Dict[str, str]:
    """
    Generate full chat metadata to pass back to the caller
    :param chat_config: config for the chat
    :return: dict of str metadata identifiers and values
    """
    meta_data = {}

    comprehension = asyncio.run(openai_manager.comprehension_score(chat_config))
    if comprehension is not None:
        meta_data["comprehension"] = str(comprehension)

    sensitive_content = openai_manager.check_for_sensitive_content(chat_config)
    if sensitive_content is not None:
        meta_data["sensitive_content"] = sensitive_content

    return meta_data


def moderation_response(violations: List[str]) -> List[str]:
    response = f"The last message violates our content moderation policy on {', '.join(violations)}. The chat has been flagged for review.  Please phrase your questions in a less harmful way."

    for i in violations:
        if "self-harm" in i:
            response += "  If you are having thoughts of self harm please reach out to a trusted friend, family member, or mentor for support."

    response_list = response.split(sep=" ")
    response_list_spaces = [i + " " for i in response_list]

    return response_list_spaces

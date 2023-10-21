import openai
from typing import List, Dict, Optional, Coroutine
import logging
from dataclasses import dataclass
from inference_service.server.judie_data import SessionConfig

logger = logging.getLogger("inference_logger")


@dataclass
class OpenAiConfig:
    model: str = "gpt-4-0613"
    temperature: float = 0.7
    max_tokens: int = 600
    top_p: int = 1


def get_gpt_response_stream(messages=None, openai_config: OpenAiConfig = None):
    chat_response = openai.ChatCompletion.create(
        model=openai_config.model,
        messages=messages,
        temperature=openai_config.temperature,
        max_tokens=openai_config.max_tokens,
        top_p=openai_config.top_p,
        frequency_penalty=0,
        presence_penalty=0,
        stream=True,
    )

    for res_chunk in chat_response:
        if hasattr(res_chunk.choices[0].delta, "content"):
            try:
                yield res_chunk.choices[0].delta.content
            except AttributeError as e:
                # catch any other attribute error other than missing `content`. That is expected
                # on the first and last messages
                logger.info(f"ATTRIBUTE ERROR: {e}")


def get_gpt_response_single(messages=None, openai_config: OpenAiConfig = None) -> str:
    chat_response = openai.ChatCompletion.create(
        model=openai_config.model,
        messages=messages,
        temperature=openai_config.temperature,
        max_tokens=openai_config.max_tokens,
        top_p=openai_config.top_p,
        frequency_penalty=0,
        presence_penalty=0,
        stream=False,
    )

    try:
        return chat_response.choices[0].message.content
    except AttributeError as e:
        logger.error(f"Error parsing OpenAi response: {e}")


async def get_gpt_response_async(
    messages=None, openai_config: OpenAiConfig = None
) -> str:
    """Response single callable asynchronously"""

    chat_response = await openai.ChatCompletion.acreate(
        model=openai_config.model,
        messages=messages,
        temperature=openai_config.temperature,
        max_tokens=openai_config.max_tokens,
        top_p=openai_config.top_p,
        frequency_penalty=0,
        presence_penalty=0,
        stream=False,
    )

    try:
        return chat_response.choices[0].message.content
    except AttributeError as e:
        logger.error(f"Error parsing OpenAi response: {e}")


def concat_sys_and_messages_openai(sys_prompt: str, messages: List[Dict]) -> List[Dict]:
    full_messages = [{"role": "system", "content": sys_prompt}]
    full_messages.extend(messages)
    return full_messages


def identify_math_exp(message: str) -> str:
    # pull the math expression from a message if it's there. Otherwise, return nothing
    prompt = [
        {
            "role": "system",
            "content": 'Identify the complete math problem in the following text and respond only with the complete question. If there is not one present, simply respond exactly with "none".',
        },
        {"role": "user", "content": message},
    ]
    config = OpenAiConfig(temperature=0.3)

    openai_response = get_gpt_response_single(messages=prompt, openai_config=config)

    # only one element in the generator because we called without streaming
    return openai_response


def comprehension_score(session_config: SessionConfig) -> Optional[int]:
    prompt = [
        {
            "role": "system",
            "content": "You are observing a conversation between a tutor and a student. On a scale "
            "of 1 to 10 classify how well the student understood the conversation and "
            "subject material given the context of the conversation and the last user "
            "response or question after the tutor.  Remember, well formed clarifying or "
            "curious questions can show comprehension.  Respond only with the numeric "
            "comprehension score on the scale of 1 to 10.",
        },
    ] + session_config.history.get_openai_format()[-5:]
    # arbitrarily use last five messages as conversation window
    # TODO bring all messages into first user block to force a regular completion instead of chat format

    comp_score = get_gpt_response_single(
        messages=prompt,
        openai_config=OpenAiConfig(temperature=0.3, max_tokens=10),
    )
    logger.info(f"Comprehension score: {comp_score}")

    if comp_score.isnumeric():
        return int(comp_score)
    else:
        return None


def check_for_sensitive_content(session_config: SessionConfig) -> Optional[str]:
    if not session_config.history.last_msg_is_user():
        return None

    prompt = [
        {
            "role": "system",
            "content": f"You are observing a conversation between a tutor and a student. Given the context of the convesation determine if there are any comments that may be inapropriate in only the latest user message.  If there is inappropriate content respond with no more than a few word description of the issues.  If the conversation does not have any problems respond only with 'none'.  Keep in mind that the student is studying {session_config.subject}, so keep in mind that some conversations may be appropriate in that context that otherwise would not be.",
        },
    ] + session_config.history.get_openai_format()[-5:]

    sensitivity_response = get_gpt_response_single(
        messages=prompt,
        openai_config=OpenAiConfig(temperature=0.3, max_tokens=10),
    )

    logger.info(f"Chat contains sensitive content of type: {sensitivity_response}")

    if "none" in str.lower(sensitivity_response) or len(sensitivity_response) == 0:
        return None
    return sensitivity_response


def check_moderation_policy(session_config: SessionConfig) -> Optional[List[str]]:
    moderation_resp = openai.Moderation.create(
        input=session_config.history.get_last_user_message()
    )

    violations = []
    for category, value in moderation_resp["results"][0]["categories"].items():
        if value is True:
            violations.append(category)
    return violations

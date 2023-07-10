import openai
from typing import List, Dict
import logging
from dataclasses import dataclass

logger = logging.getLogger("inference_logger")


@dataclass
class OpenAiConfig:
    model: str = "gpt-4-0613"
    temperature: float = 0.7
    max_tokens: int = 600
    top_p: int = 1
    stream: bool = False


def get_gpt_response(messages=None, openai_config: OpenAiConfig = None):
    chat_response = openai.ChatCompletion.create(
        model=openai_config.model,
        messages=messages,
        temperature=openai_config.temperature,
        max_tokens=openai_config.max_tokens,
        top_p=openai_config.top_p,
        frequency_penalty=0,
        presence_penalty=0,
        stream=openai_config.stream,
    )

    if openai_config.stream == True:
        for res_chunk in chat_response:
            if hasattr(res_chunk.choices[0].delta, "content"):
                try:
                    yield res_chunk.choices[0].delta.content
                except AttributeError as e:
                    # catch any other attribute error other than missing `content`. That is expected
                    # on the first and last messages
                    logger.info(f"ATTRIBUTE ERROR: {e}")
    else:
        yield chat_response.choices[0].message.content


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
    config = OpenAiConfig(temperature=0.3, stream=False)

    openai_response = get_gpt_response(messages=prompt, openai_config=config)

    # only one element in the generator because we called without streaming
    response_return = next(openai_response)
    return response_return


def comprehension_score(message_config:) -> int:
    prompt = [
        {
            "role": "system",
            "content": '',
        },
        {'role': 'assistant', "content": }
        {"role": "user", "content": message},
    ]

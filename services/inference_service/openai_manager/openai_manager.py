import openai
from typing import List, Dict

CHAT_MODEL = "gpt-4-0314"


def get_gpt_response(messages=None):
    chat_response = openai.ChatCompletion.create(
        model=CHAT_MODEL,
        messages=messages,
        temperature=0.7,
        max_tokens=600,
        top_p=1,
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
                print(f"ATTRIBUTE ERROR: {e}")


def concat_sys_and_messages_openai(sys_prompt: str, messages: List[Dict]) -> List[Dict]:
    full_messages = [{"role": "system", "content": sys_prompt}]
    full_messages.extend(messages)
    return full_messages

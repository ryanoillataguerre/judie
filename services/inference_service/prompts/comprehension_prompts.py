from inference_service.prompts.prompt_chunks import (
    TOPIC_UNDERSTANDING_CHUNKS,
    COMP_STARTER,
    COMP_CLOSER,
)
from typing import Iterable


def construct_comp_prompt_list(subject: str) -> Iterable[str]:
    subject_starter = COMP_STARTER.format(subject=subject)

    start_comp = map(lambda x: subject_starter + " " + x, TOPIC_UNDERSTANDING_CHUNKS)
    start_comp_close = map(lambda x: x + " " + COMP_CLOSER, start_comp)

    return start_comp_close

from inference_service.prompts import prompt_chunks
from inference_service.context import context_retriever
from typing import List, Optional

TOTAL_PROMPT_LIMIT = 7000


def generate_question_answer_prompt(
    question: str, subject_modifier: str = None, chat_history: Optional[List] = None
) -> str:
    try:
        if subject_modifier:
            subject_prompt = prompt_chunks.PROMPT_MAP[subject_modifier]
        else:
            subject_prompt = prompt_chunks.DEFAULT_PROMPT
    except KeyError:
        subject_prompt = prompt_chunks.DEFAULT_PROMPT
    # print(subject_prompt)

    context_block = context_retriever.pull_context_block(
        question, subject=subject_modifier
    )

    subject_plus_context = "\n".join(
        [
            subject_prompt,
            "Use the following context to help answer the next question. \n Context:",
            context_block,
        ]
    )
    # print(subject_plus_context)

    if chat_history:
        for i, c in enumerate(reversed(chat_history)):
            if i > 0:
                # create chat block in reverse history in Question: Answer: format excluding final
                # query
                pass
            break

    prompt_context_and_question = subject_plus_context + "\n Question:\n" + question
    print("Full prompt:")
    print(prompt_context_and_question)

    return {"subject": subject_plus_context}

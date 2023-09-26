from inference_service.prompts import prompt_chunks
from inference_service.context import context_retriever
from inference_service.wolfram_manager import math_api_handler
from inference_service.openai_manager import openai_manager
from typing import List, Optional


def assemble_prompt_chunks(subject: str, user_type: Optional[str] = None):
    if subject in prompt_chunks.NON_TUTOR_SUBJECTS:
        chunks = prompt_chunks[subject]
    else:
        user_chunk = prompt_chunks.STUDENT_TUTOR_CHUNK
        if user_type:
            if user_type == "PARENT":
                user_chunk = prompt_chunks.PARENT_TUTOR_CHUNK

        chunks = user_chunk
        chunks += prompt_chunks.PROMPT_MAP[subject]

        if subject in prompt_chunks.MATH_SUBJECTS:
            chunks += prompt_chunks.MATH_CHUNK

    return chunks


def generate_question_answer_prompt(
    question: str, subject: str = None, extra_context: List[str] = []
) -> str:
    special_context = extra_context

    try:
        if subject:
            subject_prompt = assemble_prompt_chunks(subject=subject)

            # special triggers
            if subject in prompt_chunks.MATH_SUBJECTS:
                math_expr = openai_manager.identify_math_exp(question)
                if "none" != str.lower(math_expr):
                    special_context.append(
                        math_api_handler.pull_show_steps(math_expresion=math_expr)
                    )

        else:
            subject_prompt = prompt_chunks.DEFAULT_PROMPT
    except KeyError:
        subject_prompt = prompt_chunks.DEFAULT_PROMPT
    # print(subject_prompt)

    context_block = context_retriever.pull_context_block(
        question, subject=subject, special_context=special_context
    )

    subject_plus_context = "\n".join(
        [
            subject_prompt,
            "Use the following context to help answer the next question. \n Context:",
            context_block,
        ]
    )
    return subject_plus_context

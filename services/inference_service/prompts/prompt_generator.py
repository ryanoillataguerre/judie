from inference_service.prompts import prompt_chunks
from inference_service.context import context_retriever
from inference_service.wolfram_manager import math_api_handler
from inference_service.openai_manager import openai_manager

TOTAL_PROMPT_LIMIT = 7000


def generate_question_answer_prompt(question: str, subject: str = None) -> str:
    special_context = None

    try:
        if subject:
            subject_prompt = prompt_chunks.PROMPT_MAP[subject]

            # special triggers
            if subject in prompt_chunks.MATH_SUBJECTS:
                math_expr = openai_manager.identify_math_exp(question)
                if "none" != str.lower(math_expr):
                    special_context = math_api_handler.pull_show_steps(
                        math_expresion=math_expr
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

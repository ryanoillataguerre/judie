from inference_service.prompts import prompt_chunks
from inference_service.context.context_retriever import pull_context


def generate_gpt_prompt(question: str, subject_modifier: str = None) -> str:
    try:
        if subject_modifier:
            subject_prompt = prompt_chunks.PROMPT_MAP[subject_modifier]
        else:
            subject_prompt = prompt_chunks.DEFAULT_PROMPT
    except KeyError:
        subject_prompt = prompt_chunks.DEFAULT_PROMPT
    print(subject_prompt)
    context = pull_context(question)
    print(context)
    subject_plus_context = "\n".join(
        [
            subject_prompt,
            "Use the following context to help answer the next question. \n Context:",
            *context,
        ]
    )
    print(subject_plus_context)
    prompt_context_and_question = subject_plus_context + "\n Question:\n" + question
    print("Full prompt:")
    print(prompt_context_and_question)

    return prompt_context_and_question

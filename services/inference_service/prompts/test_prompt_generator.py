from inference_service.prompts.prompt_generator import generate_gpt_prompt


def test_prompt_generator_e2e():
    full_prompt = generate_gpt_prompt(
        question="Teach me science", subject_modifier=None
    )
    assert len(full_prompt) > 0

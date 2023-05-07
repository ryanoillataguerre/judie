import pytest
from inference_service.prompts.prompt_generator import generate_gpt_prompt
from dotenv import load_dotenv

@pytest.fixture
def env_setup():
    load_dotenv()

def test_prompt_generator_e2e(env_setup):
    full_prompt = generate_gpt_prompt(
        question="Teach me science", subject_modifier=None
    )
    assert len(full_prompt) > 0

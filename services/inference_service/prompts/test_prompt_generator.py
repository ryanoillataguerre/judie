import pytest
from inference_service.prompts.prompt_generator import generate_question_answer_prompt
from inference_service.context.context_retriever import (
    pull_context_block,
    CONTEXT_LIMIT,
)
from dotenv import load_dotenv


@pytest.fixture
def env_setup():
    load_dotenv()


def test_prompt_generator_e2e(env_setup):
    full_prompt = generate_question_answer_prompt(
        question="Teach me science", subject_modifier=None
    )
    assert len(full_prompt) > 0


def test_subject_prompt(env_setup):
    full_prompt = generate_question_answer_prompt(
        question="Teach me science", subject_modifier="AP Biology"
    )
    assert "bio" in full_prompt


def test_context_limit(env_setup):
    assert len(pull_context_block(query="Teach me science")) <= CONTEXT_LIMIT

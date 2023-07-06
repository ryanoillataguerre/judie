import pytest
from inference_service.prompts.prompt_generator import generate_question_answer_prompt
from inference_service.context.context_retriever import (
    pull_context_block,
    CONTEXT_LIMIT,
)
from dotenv import load_dotenv
import pinecone
import os
import openai


@pytest.fixture
def env_setup():
    load_dotenv()
    pinecone.init(
        api_key=os.getenv("PINECONE_API_KEY"),
        environment=os.getenv("PINECONE_ENVIRONMENT"),
    )
    openai.api_key = os.getenv("OPENAI_API_KEY")


def test_prompt_generator_e2e(env_setup):
    full_prompt = generate_question_answer_prompt(
        question="Teach me science", subject=None
    )
    assert len(full_prompt) > 0


def test_subject_prompt(env_setup):
    full_prompt = generate_question_answer_prompt(
        question="What is photosynthesis?", subject="AP Biology"
    )
    assert "bio" in full_prompt


def test_special_context_prompt(env_setup):
    full_prompt = generate_question_answer_prompt(
        question="What is the derivative of 3x^5?",
        subject="AP Calculus AB",
    )
    print(full_prompt)
    assert "x^4" in full_prompt


def test_special_context_block(env_setup):
    context = pull_context_block(
        query="What is photosynthesis?",
        subject="AP Biology",
        special_context="Is the Pope Catholic?",
    )
    assert "the Pope" in context


def test_context_limit(env_setup):
    assert (
        len(pull_context_block(query="Teach me science", subject="AP Biology"))
        <= CONTEXT_LIMIT
    )

from typing import List, Optional

from inference_service.prompts.prompt_chunks import SUBJECT_NAMESPACE_MAP

import pinecone
import openai

CONTEXT_LIMIT = 4000

EMBEDDING_MODEL = "text-embedding-ada-002"


def pull_context_block(
    query, subject=None, special_context: Optional[str] = None
) -> str:
    contexts = pull_context(query, subject)

    running_len_contexts = len(special_context) if special_context else 0
    context_block = special_context + "\n" if special_context else ""
    over_limit = False

    if contexts:
        for i, c in enumerate(contexts):
            running_len_contexts += len(c)
            if running_len_contexts > CONTEXT_LIMIT:
                over_limit = True
                break

        if over_limit:
            last_index = i
        else:
            last_index = i + 1
        context_block += "\n".join(contexts[:last_index])

    return context_block


def pull_context(query, subject=None) -> List[str]:
    print(f"Query string: {query}")
    general_index = pinecone.Index("judieai")

    ada_embedding = openai.Embedding.create(input=[query], engine=EMBEDDING_MODEL)

    # retrieve from Pinecone
    query_vector = ada_embedding["data"][0]["embedding"]

    # get relevant contexts
    query_matches = general_index.query(
        query_vector,
        top_k=3,
        include_metadata=True,
        namespace=SUBJECT_NAMESPACE_MAP[subject]
        if subject in SUBJECT_NAMESPACE_MAP
        else None,
    )
    print(query_matches)

    context_list = [match["metadata"]["Sentence"] for match in query_matches["matches"]]
    return context_list

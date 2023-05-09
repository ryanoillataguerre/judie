import os
from typing import List

import pinecone

CONTEXT_LIMIT = 4000

def pull_context_block(query) -> str:
    contexts = pull_context(query)

    running_len_contexts = 0
    for i, c in enumerate(contexts):
        running_len_contexts += len(c)
        if running_len_contexts > CONTEXT_LIMIT:
            break

    context_block = "\n".join(contexts[:i])

    return context_block

def pull_context(query) -> List[str]:
    pinecone.init(
        api_key=os.getenv("PINECONE_API_KEY"),
        environment=os.getenv("PINECONE_ENVIRONMENT"),
    )

    general_index = pinecone.Index("judieai")
    print(general_index.describe_index_stats())
    return ["SOME CONTEXT"]

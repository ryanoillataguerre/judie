import os
from typing import List

import pinecone

CONTEXT_LIMIT = 4000


def pull_context_block(query) -> str:
    contexts = pull_context(query)

    if contexts:
        running_len_contexts = 0
        over_limit = False
        for i, c in enumerate(contexts):
            running_len_contexts += len(c)
            if running_len_contexts > CONTEXT_LIMIT:
                over_limit = True
                break

        if over_limit:
            last_index = i
        else:
            last_index = i + 1
        context_block = "\n".join(contexts[:last_index])
    else:
        context_block = ""

    return context_block


def pull_context(query) -> List[str]:
    pinecone.init(
        api_key=os.getenv("PINECONE_API_KEY"),
        environment=os.getenv("PINECONE_ENVIRONMENT"),
    )

    general_index = pinecone.Index("judieai")
    print(general_index.describe_index_stats())
    return ["SOME CONTEXT"]

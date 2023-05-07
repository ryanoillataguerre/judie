import os
from typing import List

import pinecone


def pull_context(query) -> List[str]:
    pinecone.init(
        api_key=os.getenv("PINECONE_API_KEY"),
        environment=os.getenv("PINECONE_ENVIRONMENT"),
    )

    general_index = pinecone.Index("judieai")
    print(general_index.describe_index_stats())
    return ["SOME CONTEXT"]

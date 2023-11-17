import pinecone
import argparse


def remove_all_vectors_from_namesapce(index_name: str, namespace: str) -> None:
    index = pinecone.Index(index_name)
    index.delete(ids=[], delete_all=True, namespace=namespace)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        prog="ContextAdminCmd",
        description="This command allows for easy running of Pinecone administration commands like bulk removals of vectors.",
    )

    parser.add_argument("-r", "--remove_from_namespace", default=False, type=bool)
    parser.add_argument("-i", "--index_name", default="knowledge-base-v2")
    parser.add_argument("-n", "--namespace")

    args = parser.parse_args()

    if args.remove_from_namespace:
        if args.namespace:
            remove_all_vectors_from_namesapce(
                index_name=args.index_name, namespace=args.namespace
            )
        else:
            raise ValueError(
                "--namespace argument required when running removal. Please provide."
            )

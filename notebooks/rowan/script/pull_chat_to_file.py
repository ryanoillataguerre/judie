"""
Pull chat transcript from BigQuery and write to file for better readability.

test ids:
1946d447-4d94-4098-8e29-b5cd60ea5869
46c01f3d-08c3-4885-a5ad-a91775a301e6
09b2d1e9-2dcb-4e42-87be-b36cd2e65cac

Date: 2023-10-24 (modified 2023-10-24)
"""
import argparse
import os
import sys

sys.path.insert(1, os.path.join(sys.path[0], '..'))
from src.chat_utils import ChatUtils
from src.general_utils import load_params


CONFIG_FILE = "config.yaml"


def setup_argparser() -> argparse.ArgumentParser:
    """
    Set up the command line arguement parser.

    Returns:
        A configured argparse object
    """
    parser = argparse.ArgumentParser(
        description="""This script pulls a chat into a file for ease of readability."""
    )
    parser.add_argument(
        '--chat_id', type=str, help='The chat_id to pull'
    )
    parser.add_argument(
        "--config_file", type=str, default=CONFIG_FILE, help="""Config file to use."""
    )
    return parser


if __name__ == "__main__":
    # Capture command line arguments and configs
    parser = setup_argparser()
    args = parser.parse_args()
    params = load_params(args.config_file)

    # Define ChatUtils utility object
    chat_utils = ChatUtils()

    # Define query parameters
    query = params["sql"]["select_transcripts"]
    query_params = dict(params["gcp"], **params["tables"])

    # Pull chat to a file
    chat_utils.pull_chat_to_file(args.chat_id, query, query_params)


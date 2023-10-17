"""
Exploration script to run queries against BigQuery.

Date: 2023-10-16 (modified 2023-10-16)
"""
import argparse


from src.bq_utils import BQUtils
from src.general_utils import load_params


CONFIG_FILE = "config.yaml"


def setup_argparser() -> argparse.ArgumentParser:
    """
    Set up the command line arguement parser.

    Returns:
        A configured argparse object
    """
    parser = argparse.ArgumentParser(
        description="""This script ingests option chain data using Yahoo Finance API."""
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

    bq_utils = BQUtils(params["gcp"]["sandbox_project_id"])

    query_params = dict(params["gcp"], **params["tables"])
    df = bq_utils.run_query_to_df(params["sql"]["users_query"], query_params)


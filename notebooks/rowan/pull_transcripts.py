"""
Pull chat transcripts from BigQuery for better readability and save to GCS.
test ids:
1946d447-4d94-4098-8e29-b5cd60ea5869
21798d5c-834c-4872-9f4b-4c68f840f990

Date: 2023-10-19 (modified 2023-10-19)
"""
import argparse
import os
from datetime import datetime


from src.gcp_utils import BQUtils, GCSUtils
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
        '--chat_ids', nargs='*', type=str, default=[], help='A list of chat_ids to pull from')
    parser.add_argument(
        "--config_file", type=str, default=CONFIG_FILE, help="""Config file to use."""
    )
    parser.add_argument(
        "--dataset", type=str, default="rowan_tmp_dataset",
        help="""The name of the BQ dataset to which to save data."""
    )
    parser.add_argument(
        "--table", type=str, default="rowan_tmp_table",
        help="""The name of the BQ table to which to save data."""
    )
    parser.add_argument(
        "--bucket", type=str, default="judie-exploration",
        help="""The name of the bucket to which to save data."""
    )
    parser.add_argument(
        "--file_format", type=str, default="csv",
        help="""The file format to use when saving the data."""
    )
    return parser


if __name__ == "__main__":
    # Capture command line arguments and configs
    parser = setup_argparser()
    args = parser.parse_args()
    params = load_params(args.config_file)

    # Define BigQuery utility object
    bq_utils = BQUtils(params["gcp"]["sandbox_project_id"])

    # Pull data from BigQuery
    query_params = dict(params["gcp"], **params["tables"])
    if not args.chat_ids:
        query_file = params["sql"]["all_transcripts"]
    else:
        query_file = params["sql"]["select_transcripts"]
        query_params.update({"chat_ids": str(tuple(args.chat_ids))})

    bq_utils.run_query_to_bq_table(query_file, query_params, args.dataset, args.table)

    # Extract data to Google Cloud Storage
    #file_name = f"transcripts_{datetime.now().strftime('%Y-%m-%d_%H:%M:%S')}.{args.file_format}"
    #prefix = os.path.join(params["gcs"]["base"], params["gcs"]["transcripts"], file_name)

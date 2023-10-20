"""
Pull chat transcripts from BigQuery for better readability and save to GCS.

Note: The table name that is passed to hold the intermediary results will be replaced if
      there is a naming conflict.

test ids:
1946d447-4d94-4098-8e29-b5cd60ea5869
46c01f3d-08c3-4885-a5ad-a91775a301e6
09b2d1e9-2dcb-4e42-87be-b36cd2e65cac

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
        "--dataset", type=str, default="rowan_dataset",
        help="""The name of the BQ dataset to which to save data."""
    )
    parser.add_argument(
        "--table", type=str, default="rowan_transcript_table",
        help="""The name of the BQ table to which to save data."""
    )
    parser.add_argument(
        "--table_write_mode", type=str, default="WRITE_EMPTY",
        help="""How to treat existing table {WRITE_EMPTY, WRITE_APPEND, WRITE_TRUNCATE}"""
    )
    parser.add_argument(
        "--bucket", type=str, default="judie-exploration-us-west1",
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

    # Define query parameters
    query_params = dict(params["gcp"], **params["tables"])
    if not args.chat_ids:
        query_file = params["sql"]["all_transcripts"]
    else:
        query_file = params["sql"]["select_transcripts"]
        query_params.update({"chat_ids": str(tuple(args.chat_ids))})

    # Pull data from BigQuery to Google Cloud Storage
    file_name = f"transcripts_{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}.{args.file_format}"
    prefix = os.path.join(params["gcs"]["base"], params["gcs"]["transcripts"], file_name)
    bq_utils.run_query_to_gcs(
        query_file,
        query_params,
        args.bucket,
        prefix,
        args.file_format,
        args.dataset,
        args.table,
        args.table_write_mode
    )


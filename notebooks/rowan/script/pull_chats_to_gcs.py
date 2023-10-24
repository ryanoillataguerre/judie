"""
Pull chat transcripts from BigQuery for better readability and save to GCS.

Note: If the table name that is passed to hold the intermediary results already exists, no new
      data will be added to the table unless the `table_write_mode` is changed from the default.

test ids:
1946d447-4d94-4098-8e29-b5cd60ea5869
46c01f3d-08c3-4885-a5ad-a91775a301e6
09b2d1e9-2dcb-4e42-87be-b36cd2e65cac

Date: 2023-10-19 (modified 2023-10-19)
"""
import argparse
import os
import sys
from datetime import datetime

sys.path.insert(1, os.path.join(sys.path[0], '..'))
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
        description="""This script pulls chat transcripts into GCS for ease of readability."""
    )
    parser.add_argument(
        "--config_file", type=str, default=CONFIG_FILE, help="""Config file to use."""
    )
    parser.add_argument(
        '--chat_ids', nargs='*', type=str, default=[],
        help='A list of chat_ids to pull (use "all" to pull all chats - careful with data size)'
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
        help="""The name of the bucket to which to save the data."""
    )
    parser.add_argument(
        "--dir_prefix", type=str, default="",
        help="""The prefix (directory path not file path) to which to save the transcript files."""
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
    dt_str = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')

    # Dump all raw data into a single file (or directory if parquet)
    if args.file_format.lower() == "parquet":
        dump_path = f"transcripts_dump_{dt_str}"
    else:
        dump_path = f"transcripts_dump_{dt_str}.{args.file_format}"

    if not args.dir_prefix:
        prefix = os.path.join(params["gcs"]["base"], params["gcs"]["transcripts"])

    dump_prefix = os.path.join(prefix, dump_path)

    # Pull all transcript records into GCS
    bq_utils.run_query_to_gcs(
        query_file,
        query_params,
        args.bucket,
        dump_prefix,
        args.file_format,
        args.dataset,
        args.table,
        args.table_write_mode
    )


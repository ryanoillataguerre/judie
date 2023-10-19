"""
Exploration script to run queries against BigQuery.

Date: 2023-10-16 (modified 2023-10-16)
"""
import argparse
import os


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
        "--config_file", type=str, default=CONFIG_FILE, help="""Config file to use."""
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

    # Define utility objects
    bq_utils = BQUtils(params["gcp"]["sandbox_project_id"])
    gcs_utils = GCSUtils(params["gcp"]["sandbox_project_id"])

    # Pull data from BigQuery
    query_params = dict(params["gcp"], **params["tables"])
    df = bq_utils.run_query_to_df(params["sql"]["users_query"], query_params)

    # Save data to Google Cloud Storage
    prefix = os.path.join(
        params["gcs"]["base"], params["gcs"]["analytics"], params["gcs"]["user_stats"]
    ) + "." + args.file_format
    gcs_utils.write_pd_dataframe_to_gcs(df, args.bucket, prefix, args.file_format)

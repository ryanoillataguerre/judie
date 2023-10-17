"""
This module allows for running queries against BigQuery.

Date: 2023-10-16 (modified 2023-10-16)
"""
import json
import logging
import os
from io import BytesIO
from typing import Optional

import pandas as pd
from google.cloud import bigquery, bigquery_storage, storage
from jinja2 import Template

from src.general_utils import get_logger


class GCPUtils:
    """Base class with common functions for other GCP util classes."""

    def set_logger(self, logger: Optional[logging.Logger] = None) -> None:
        """Set the logger for the class instance.
        """
        if logger is None:
            self.logger = get_logger(name=__name__)
        else:
            self.logger = logger

    def set_gcp_project_id(self, gcp_project_id: str) -> None:
        """Set the GCP project_id for the class instance.

        Args:
            gcp_project_id  : The GCP project-id with which to interact
        """
        self.gcp_project_id = gcp_project_id


class GCSUtils(GCPUtils):
    """Class that defines utility functions for GCP Cloud Storage.

        Attributes:
            gcp_project_id  : The GCP project-id with which to interact
            logger          : Logger to use when displaying logs
    """

    def __init__(self, gcp_project_id: str, logger: Optional[logging.Logger] = None) -> None:
        """Init method.

        Args:
            gcp_project_id  : The GCP project-id with which to interact
            logger          : Optional logger to use when displaying logs
        """
        self.set_gcp_project_id(gcp_project_id)
        self.set_logger(logger)

    def write_pd_dataframe_to_gcs(
        self, df: pd.DataFrame, bucket: str, prefix: str, file_format: str="parquet",
    ) -> None:
        """Write a Pandas dataframe to Google Cloud Storage.

        Args:
            df          : The Pandas dataframe to write
            bucket      : The bucket to which to write
            prefix      : The gcs path within the bucket
            file_format : The file format to use when writing
        """
        self.logger.info(f"Writing dataframe to {bucket}/{prefix} as a {file_format} file ...")
        client = storage.Client(project=self.gcp_project_id)
        bucket = client.bucket(bucket)
        blob = bucket.blob(prefix)

        # Convert dataframe to in-memory bytes buffer
        buffer = BytesIO()

        # Save DataFrame to a Parquet format and upload to GCS
        if file_format == "parquet":
            df.to_parquet(buffer, index=False, compression='snappy')
        elif file_format == "csv":
            df.to_csv(buffer, index=False)
        else:
            raise ValueError(f"Unsupported file format: {file_format}")

        # Create a blob and upload the file's content (seek buffer to beginning)
        buffer.seek(0)
        blob = bucket.blob(prefix)
        blob.upload_from_file(buffer, content_type='application/octet-stream')
        self.logger.info(f"Dataframe written successfully.")


class BQUtils(GCPUtils):
    """Class that defines utility functions for GCP BigQuery.

        Attributes:
            gcp_project_id  : The GCP project-id with which to interact
            logger          : Logger to use when displaying logs
    """

    def __init__(self, gcp_project_id: str, logger: Optional[logging.Logger] = None) -> None:
        """Init method.

        Args:
            gcp_project_id  : The GCP project-id with which to interact
            logger          : Optional logger to use for logging
        """
        self.set_gcp_project_id(gcp_project_id)
        self.set_logger(logger)

    def get_query_from_file(self, query_file: str) -> str:
        """Read query from a file and return the query string.

        Args:
            query_file  : The path to the query file
        Return:
            query       : The query string from the file
        """
        # Read in query
        try:
            with open(query_file, "rt") as f:
                query_ls_tmp = f.readlines()
        except Exception as e:
            query_ls_tmp = []
            custom_msg = (f"Problems reading query from {query_file}\n"
                          f"Returning None for query_ls")
            self.logger.exception(custom_msg)
            raise

        # Remove empty lines
        query_ls = [l for l in query_ls_tmp if l.strip() != ""]

        # Remove final ';' if present and remove comments
        if query_ls[-1].strip() == ";":         # remove ; if it is on a line by itself
            del query_ls[-1]
        elif query_ls[-1].strip()[-1] == ";":   # remove ; if on a line with other commands
            query_ls[-1] = query_ls[-1].strip()[:-1]
        query = "".join([query_line for query_line in query_ls if query_line[:2] != "--"])

        return query

    def template_query(self, qstr: str, params: dict={}) -> str:
        """Read in query from file, or use query string, and render templated query.

        Queries are able to be Jinja templates, and are then rendered using the data in the
        `params` keyword.

        Args:
            qstr            : query to be executed. Can be a string or the path to the query file
            params          : dictionary of parameters needed to configure the query
        Return:
            formatted_qstr  : The query to be executed
        """
        # if the input qstr contains spaces, then it is considered a query string
        if " " in qstr:
            query = qstr.strip()
            if query[-1] == ";":
                query = query[:-1]

        # If the input does not contain spaces, then it is treated as a file path
        else:
            self.logger.info(f"Reading query file: {qstr} ...")
            query = self.get_query_from_file(qstr)

        # Render Jinja template
        self.logger.info("Query params:\n{}".format(json.dumps(params,
                                                        indent=4,
                                                        default=str)))
        formatted_qstr = Template(query).render(params=params or {})
        return formatted_qstr

    def run_query_to_df(self, query_file: str, query_params_dc: dict) -> pd.DataFrame:
        """Run query and return results in a Pandas DataFrame.

        Args:
            query_file      : Path to query file to run
            query_params_dc : Parameters to use when completing the query template
        Return:
            df              : Results in a dataframe
        """
        self.logger.info(f"Reading query from {query_file} and templating ...")
        query = self.template_query(query_file, query_params_dc)

        self.logger.info("Instantiating bigquery.Client() and bigquery_storage clients ...")
        try:
            client = bigquery.Client(project=self.gcp_project_id)
            bqstorage_client = bigquery_storage.BigQueryReadClient()
        except OSError:
            self.logger.exception("Issue creating BQ clients")
            raise

        self.logger.info(f"Running query ...\n{query}")
        try:
            query_job = client.query(query)
        except Exception:
            self.logger.exception(e)
            raise

        self.logger.info("Converting results to dataframe ...")
        df = query_job.to_arrow(bqstorage_client=bqstorage_client).to_pandas()
        #df = query_job.to_dataframe()
        self.logger.info(f"Results in df with shape: {df.shape}")
        self.logger.info(f"\n{df.head()}")
        return df


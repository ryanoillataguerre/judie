"""
This module allows for running queries against BigQuery.

Date: 2023-10-16 (modified 2023-10-19)
"""
import json
import logging
import os
from io import BytesIO
from typing import Optional

import pandas as pd
import pyarrow
from google.api_core.exceptions import GoogleAPICallError
from google.cloud import bigquery, bigquery_storage, storage
from jinja2 import Template

from src.general_utils import get_logger


ALLOWED_FILE_FORMATS = ('csv', 'parquet')  # Move to enum or config later


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

    def _is_valid_file_format(self, file_format: str) -> bool:
        """Validate that passed in file_format is one of the allowed formats.

        Args:
            file_format : The file format to check, e.g. 'csv', 'parquet'
        Return:
            True/False depending on whether file_format in ALLOWED_FILE_FORMATS list
        """
        if file_format.lower() not in ALLOWED_FILE_FORMATS:
            self.logger.error(
                f"Invalid file_format ({file_format.lower()})\n",
                f"file_format must be one of {ALLOWED_FILE_FORMATS}"
            )
            return False
        else:
            return True


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
        self.set_logger(logger)
        self.set_gcp_project_id(gcp_project_id)

    def _get_storage_client(self) -> storage.Client:
        """Instantiate a GCS storage client.

        Return
            GSC storage client object.
        """
        try:
            return storage.Client(project=self.gcp_project_id)
        except GoogleAPICallError as e:
            self.logger.exception(f"Failed to initialize GSC storage client: {e}")
        except Exception as e:
            self.logger.exception(f"An unexpected error occurred: {e}")

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
        if not self._is_valid_file_format(file_format):
            self.logger.error(f"File not written because of invalid file_format.")
            return

        self.logger.info(f"Writing dataframe to {bucket}/{prefix} as a {file_format} file ...")
        client = self._get_storage_client()
        bucket = client.bucket(bucket)
        blob = bucket.blob(prefix)

        # Use in-memory bytes buffer to Convert dataframe
        buffer = BytesIO()

        # Save DataFrame to a Parquet format and upload to GCS
        if file_format == "csv":
            df.to_csv(buffer, index=False)
        elif file_format == "parquet":
            df.to_parquet(buffer, index=False, compression='snappy')
        else:
            raise ValueError(f"Unsupported file format: {file_format}")

        try:
            # Create a blob and upload the file's content (seek buffer to beginning)
            buffer.seek(0)
            blob = bucket.blob(prefix)
            blob.upload_from_file(buffer, content_type='application/octet-stream')
        except GoogleAPICallError as e:
            self.logger.exception(f"Failed to write data: {e}")
        except Exception as e:
            self.logger.exception(f"An unexpected error occurred: {e}")

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
        self.set_logger(logger)
        self.set_gcp_project_id(gcp_project_id)

    def _get_bq_client(self) -> bigquery.Client:
        """Instantiate a BigQuery client.

        Return
            BigQuery client object.
        """
        try:
            return bigquery.Client(project=self.gcp_project_id)
        except GoogleAPICallError as e:
            self.logger.exception(f"Failed to initialize BigQuery client: {e}")
        except Exception as e:
            self.logger.exception(f"An unexpected error occurred: {e}")

    def _get_bq_storage_client(self) -> bigquery_storage.BigQueryReadClient:
        """Instantiate a BigQueryReadClient.

        Return
            BigQueryReadClient object.
        """
        try:
            return bigquery_storage.BigQueryReadClient()
        except GoogleAPICallError as e:
            self.logger.exception(f"Failed to initialize BigQueryReadClient: {e}")
        except Exception as e:
            self.logger.exception(f"An unexpected error occurred: {e}")

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
        except (IOError, FileNotFoundError) as e:
            query_ls_tmp = []
            custom_msg = (f"Problems reading query from {query_file}\n"
                          f"Returning empty list for query_ls")
            self.logger.exception(custom_msg)

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

    def run_query(
        self,
        query_file: str,
        query_params: dict,
        job_config: Optional[bigquery.QueryJobConfig]=None,
    ) -> bigquery.job.query.QueryJob:
        """Run a query against BigQuery.

        Args:
            query_file      : Path to query file to run
            query_params    : Parameters to use when completing the query template
            job_config      : Optional job configurations for the query
        Return:
            QueryJob object
        """
        self.logger.info(f"Reading query from {query_file} and templating ...")
        query = self.template_query(query_file, query_params)

        self.logger.info("Instantiating bigquery.Client() ...")
        client = self._get_bq_client()

        self.logger.info(f"Running query ...\n{query}")
        try:
            if job_config:
                query_job = client.query(query, job_config=job_config)
            else:
                query_job = client.query(query)
            query_job.result()  # Wait for the query to complete

            if query_job.errors:
                for error in query_job.errors:
                    self.logger.error(f"Error: {error['message']}")
            else:
                self.logger.info("Query completed successfully.")

        except GoogleAPICallError as e:
            self.logger.exception(f"An error occurred while querying or fetching the data: {e}")

        except Exception as e:
            self.logger.exception(f"An unexpected error occurred: {e}")

        return query_job

    def run_query_to_df(self, query_file: str, query_params: dict) -> pd.DataFrame:
        """Run query and return results in a Pandas DataFrame.

        Args:
            query_file      : Path to query file to run
            query_params    : Parameters to use when completing the query template
        Return:
            df              : Results in a dataframe
        """
        # Run query
        query_job = self.run_query(query_file, query_params)

        # Convert results to pd.DataFrame
        self.logger.info("Instantiating BigQueryReadClient ...")
        bqstorage_client = self._get_bq_storage_client()
        try:
            self.logger.info("Converting results to dataframe ...")
            df = query_job.to_arrow(bqstorage_client=bqstorage_client).to_pandas()

        except pyarrow.ArrowInvalid as e:
            self.logger.exception(f"An error occurred converting the data to a pd.DataFrame: {e}")

        self.logger.info(f"Results in df with shape: {df.shape}")
        self.logger.info(f"\n{df.head()}")
        return df

    def run_query_to_bq_table(
        self,
        query_file: str,
        query_params: dict,
        dataset: str,
        table: str
    ) -> None:
        """Run query and save results in a BigQuery dataset.table.

        Args:
            query_file      : Path to query file to run
            query_params    : Parameters to use when completing the query template
            dataset         : The dataset in BigQuery to which to save the data 
            table           : The table in BigQuery to which to save the data
        """
        # Initialize a BigQuery client
        client = self._get_bq_client()

        # Specify the destination table
        table_ref = client.dataset(dataset).table(table)
        job_config = bigquery.QueryJobConfig()
        job_config.destination = table_ref

        # Run query
        query_job = self.run_query(query_file, query_params, job_config)

    def extract_bq_table_to_gcs(
        self,
        dataset: str,
        table: str,
        bucket: str,
        prefix: str,
        file_format: str='csv',
    ) -> None:
        """Run a query and export results to specified bucket/prefix.

        Args:
            dataset     : The dataset in BigQuery that has the data
            table       : The table in BigQuery with the data to extract
            bucket      : The bucket for the query results
            prefix      : The full file prefix including file extension
            file_format : Which file format to use when writing results, e.g. 'csv' or 'parquet'

        """
        if not self._is_valid_file_format(file_format):
            self.logger.error(f"Query not run because of invalid file_format.")
            return

        self.logger.info(
            f"Exporting query results to {bucket}/{prefix} as a {file_format} file ..."
        )

        # Initialize a BigQuery client
        client = self._get_bq_client()

        # Specify the destination URI, format, and other export options
        destination_uri = f"gs://{bucket}/{prefix}"
        table_ref = client.dataset(dataset).table(table)

        extract_job_config = bigquery.job.ExtractJobConfig()
        extract_job_config.destination_format = (bigquery.DestinationFormat.CSV
                                                 if file_format.lower() == 'csv'
                                                 else bigquery.DestinationFormat.PARQUET)

        try:
            # Start the export job
            extract_job = client.extract_table(
                table_ref,
                destination_uri,
                job_config=extract_job_config
            )
            extract_job.result()  # Wait for the job to complete

            # Check for errors
            if extract_job.errors:
                for error in extract_job.errors:
                    self.logger.error(f"Error: {error['message']}")
            else:
                self.logger.info("Export job completed successfully")

        except GoogleAPICallError as e:
            self.logger.exception(f"Failed to initiate export job: {e}")

        except Exception as e:
            self.logger.exception(f"An unexpected error occurred: {e}")


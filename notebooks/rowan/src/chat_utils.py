"""Utility class for chat-related functions.

Date: 2023-10-23 (modified 2023-10-23)
"""
import logging
import os
from datetime import datetime
from typing import Any, Dict, Optional

import pandas as pd

from src.gcp_utils import BQUtils, GCSUtils
from src.general_utils import get_logger


class ChatUtils:
    """Class that defines utility functions for working with chat data.

        Attributes:
            logger          : Logger to use when displaying logs
    """

    def __init__(self, logger: Optional[logging.Logger] = None,) -> None:
        """Init method.

        Args:
            gcp_project_id  : The GCP project-id with which to interact
            gcp_location    : The location to use with the GCP project
            logger          : Optional logger to use when displaying logs
        """
        if logger is None:
            self.logger = get_logger(name=__name__)
        else:
            self.logger = logger

    def get_subject(self, df: pd.DataFrame) -> str:
        """Pull the subject from the chat or return `no_subject`.

        Args:
            df      : The dataframe with the chat info
        Return:
            subject : The identified subject or `no_subject`
        """
        subject = (
            df["subject"].iloc[0].replace(" ", "_").replace("_-", "").lower()
            if df["subject"].iloc[0]
            else "no_subject"
        )
        return subject

    def parse_chat_from_df_to_file(
        self, df: pd.DataFrame, outfile: Optional[str] = None
    ) -> None:
        """Write the chat from a DataFrame into a file in a readable format.

        The dataframe is assumed to contain the following columns:
            role, readable_content, message_created_at, subject,
            user_id, is_judie, chat_created_at, chat_id

        Args:
            df      : The dataframe with the chat info
            outfile : Optional file path to which to write the chat
        """
        meta_info = (
            f"Subject: {self.get_subject(df)}\n"
            f"Created at: {df['chat_created_at'].iloc[0]}\n"
            f"Number of messages: {len(df)}\n"
            f"Chat ID: {df['chat_id'].iloc[0]}\n"
            f"User ID: {df['user_id'].iloc[0]}\n"
            f"Judie email: {df['is_judie'].iloc[0]}\n\n"
        )
        self.logger.info(f"Chat information:\n{meta_info}")

        if outfile is None:
            outfile = f"{len(df)}_{self.get_subject(df)}_{df['chat_id'].iloc[0]}.txt"

        self.logger.info(f"Writing chat to {outfile} ...")
        with open(outfile, 'wt') as f:
            f.write(meta_info)
            for _, row in df.iterrows():
                f.write(f"{'-' * 100}\n")
                f.write(f"{row.role} ({row.message_created_at}): {row.readable_content}\n\n")

        self.logger.info("Chat written successfully.")

    def pull_chat_to_file(
        self,
        chat_id: str,
        query: str,
        query_params: Dict[str, str],
        outfile: Optional[str] = None,
    ) -> None:
        """Pull a chat from BigQuery into a file in a more readable format.

        Args:
            chat_id         : The chat ID to pull
            query_params    : The parameters to use for the query. Keys must include:
                                - prod_project_id
                                - sandbox_project_id
                                - prod_db
                                - chats_table
                                - messages_table
                                - users_table
            query           : The query file to use
            outfile         : The file to which to write the chat
        """
        bq_utils = BQUtils(query_params["sandbox_project_id"])
        query_params["chat_ids"] = f"('{chat_id}')"  # `chat_id IN ('<chat_id>')` in query

        df = bq_utils.run_query_to_df(query, query_params)

        if outfile is None:
            outfile = f"{len(df)}_{self.get_subject(df)}_{chat_id}.txt"

        self.parse_chat_from_df_to_file(df, outfile)

    def parse_transcripts_from_file(self, infile: str, outdir: str) -> None:
        """Read the full transcript dump file and parse chats into individual files.

        The file is assumed to contain the following columns:
            role, readable_content, message_created_at, subject,
            user_id, is_judie, chat_created_at, chat_id

        Args:
            infile  : The file containing the raw transcript data
            outdir  : The dictory path for writing the individual transcript files
        """
        self.logger.info(f"Reading chat data from {infile} ...")
        df = pd.read_csv(dump_path, keep_default_na=False)
        chat_ids = list(df["chat_id"].unique())

        for chat in chat_ids:
            df_tmp = df[df.chat_id == chat]
            subject = self.get_subject(df_tmp)
            outfile = os.path.join(outdir, f"{len(df_tmp)}_{subject}_{chat}.txt")
            self.parse_chat_from_df_to_file(df_tmp, outfile)


import argparse
import os.path

from inference_service.context import context_ingestor
from inference_service.logging_utils import logging_utils
from typing import List
from inference_service.test_client.testing_utils import env_setup_cmd


def parse_pages(page_ranges: List[str]):
    """
    Parse page range strs into list of individual pages, 0 indexed
    :param page_ranges: list of strs in format '33-35'
    :return: List of int page indices
    """
    if page_ranges is None:
        return None

    page_nums = []
    for pages in page_ranges:
        start_page = int(pages.split("-")[0])
        if start_page <= 0:
            raise ValueError(
                f"Please specify page numbers as they appear on the PDF. {start_page} is not valid."
            )

        end_page = int(pages.split("-")[1])

        if start_page > end_page:
            raise ValueError(
                "Invalid page range. Start pages must be less than end pages."
            )

        for p in range(start_page - 1, end_page):
            page_nums.append(p)

    return page_nums


if __name__ == "__main__":
    logging_utils.setup_logger("cmd_logger")
    env_setup_cmd()

    parser = argparse.ArgumentParser(
        prog="ContextIngestionCmd",
        description="This command takes a PDF file of educational content and associate subject and license, parsers it, and uploads it properly to pinecone.",
        epilog="See inference_service.context.context_ingestor for more.",
    )
    parser.add_argument("-f", "--file_path", required=True)
    parser.add_argument(
        "-p",
        "--pages",
        nargs="*",
        help="Page numbers of PDF file to ingest. Format should follow ex: 33-35 37-50",
    )
    parser.add_argument("-i", "--index_name", default="knowledge-base-v2")
    args = parser.parse_args()

    chunks = context_ingestor.read_and_chunk_text(
        file_path=args.file_path, pages=parse_pages(args.pages)
    )

    context_ingestor.upload_chunks(
        chunks=chunks,
        index_name=args.index_name,
        file_id=os.path.basename(args.file_path),
    )
    exit(0)

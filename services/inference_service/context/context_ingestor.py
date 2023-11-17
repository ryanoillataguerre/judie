import pinecone
import openai
from langchain.text_splitter import RecursiveCharacterTextSplitter
import PyPDF2
import logging
from typing import Optional, List
from tqdm import tqdm
import os

logger = logging.getLogger("cmd_logger")


def read_text_from_pdf(file_path, pages: Optional[List[int]] = None) -> str:
    logger.info(file_path)
    reader = PyPDF2.PdfReader(file_path)

    if pages is None:
        pages = range(len(reader.pages))

    total_text = ""

    logger.info("Parsing pages of PDF...")
    for i in tqdm(pages):
        total_text += reader.pages[i].extract_text()

    return total_text


def chunk_text(total_text: str) -> List[str]:
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=2048,
        chunk_overlap=200,
        length_function=len,
        is_separator_regex=False,
    )

    return text_splitter.split_text(total_text)


def read_and_chunk_text(file_path, pages: Optional[List[int]] = None) -> List[str]:
    full_text = read_text_from_pdf(file_path=file_path, pages=pages)
    return chunk_text(full_text)


def upload_chunks(
    chunks: List[str],
    index_name: str,
    file_id: str,
    namespace: Optional[str] = "default",
) -> None:
    index = pinecone.Index(index_name)
    EMBEDDING = os.getenv("EMBEDDING_MODEL")

    vectors = []
    id_index = 1

    logger.info(
        f"Uploading chunked text to Pinecone index: {index_name}, on namespace: {namespace}"
    )
    for chunk in tqdm(chunks):
        chunk_embedding = openai.Embedding.create(input=[chunk], engine=EMBEDDING)[
            "data"
        ][0]["embedding"]

        vectors.append(
            {
                "id": f"{file_id}-{id_index}",
                "values": chunk_embedding,
                "metadata": {"text": chunk},
            }
        )

        if id_index % 100 == 0:
            index.upsert(vectors=vectors, namespace=namespace)
            vectors = []

        id_index += 1
    index.upsert(vectors=vectors, namespace=namespace)

import logging
import os
import urllib3
from typing import Optional
from lxml import etree

logger = logging.getLogger("inference_logger")


def pull_show_steps(
    math_expresion: str, http_pool: Optional[urllib3.PoolManager] = None
):
    if not http_pool:
        http_pool = urllib3.PoolManager()
    response = http_pool.request(
        "GET",
        f"http://api.wolframalpha.com/v2/query?appid={os.getenv('WOLFRAM_APP_ID')}&input={math_expresion}&podstate=Result__Step-by-step+solution&format=plaintext",
    )
    logger.debug("Response received from wolfram")

    tree = etree.fromstring(response.data)

    # take text from primary response from primary evaluation type
    try:
        math_steps = tree.xpath("pod/subpod/plaintext")[0].text
    except Error as e:
        logger.info(f"Error parsing Wolfram steps response: {e}")
        math_steps = ""

    # grab additional context from primary evaluation
    info = [
        x.attrib["text"] for x in tree.xpath("pod/infos/info") if "text" in x.attrib
    ]

    math_context = math_steps
    for i in info:
        math_context += "\n" + i

    return math_context

import os

import urllib3
from typing import Optional


def pull_show_steps(
    math_expresion: str, http_pool: Optional[urllib3.PoolManager] = None
):
    if not http_pool:
        http_pool = urllib3.PoolManager()
    response = http_pool.request(
        "GET",
        f"http://api.wolframalpha.com/v2/query?appid={os.getenv('WOLFRAM_APP_ID')}&input={math_expresion}%3D11&podstate=Result__Step-by-step+solution&format=plaintext",
    )

    return response

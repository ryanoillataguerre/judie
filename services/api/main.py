import json
from fastapi import FastAPI

app = FastAPI()


@app.get("/health")
async def healthcheck():
    return json.dumps({"status": "ok"})

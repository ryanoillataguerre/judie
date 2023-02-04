from fastapi import FastAPI

app = FastAPI()


@app.get("/health")
async def healthcheck():
    return {"status": "ok"}

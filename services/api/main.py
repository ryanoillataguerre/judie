from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI()


@app.exception_handler(Exception)
def validation_exception_handler(request, err):
    base_error_message = f"Failed to execute: {request.method}: {request.url}"
    return JSONResponse(
        status_code=400, content={"message": f"{base_error_message}. Detail: {err}"}
    )


@app.get("/health")
async def healthcheck():
    return {"status": "ok"}

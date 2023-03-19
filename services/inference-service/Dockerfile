FROM python:3.10-slim

WORKDIR /app

COPY inference_requirements.txt ./

RUN pip install --no-cache-dir -r /app/inference_requirements.txt

COPY server/ ./

COPY ./ /app

CMD ["python", "docker_test.py"]
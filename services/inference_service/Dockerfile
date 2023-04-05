FROM python:3.10-slim

WORKDIR /app

COPY ./ ./inference_service/


RUN pip install --no-cache-dir -r inference_service/inference_requirements.txt



ENV PYTHONPATH "${PYTHONPATH}:/app/"

EXPOSE 443
# Cloud run requires it
EXPOSE 8080

ENV GRPC_PORT=443
# ENV GRPC_VERBOSITY=debug

CMD ["python", "-u", "inference_service/server/inference_service_server.py"]
FROM python:3.10-slim

WORKDIR /app

COPY inference_requirements.txt ./

RUN pip install --no-cache-dir -r /app/inference_requirements.txt

COPY server/ ./

COPY ./ /app

EXPOSE 443

ENV GRPC_PORT=443
# ENV GRPC_VERBOSITY=debug

CMD ["python", "-u", "inference_service_server.py"]
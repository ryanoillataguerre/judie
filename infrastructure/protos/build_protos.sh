#!/usr/bin/env bash
cd "${0%/*}"

OUT_PATH=../../services/inference-service/server
python -m grpc_tools.protoc --proto_path=../../services/inference-service/protos ---python_out=$OUT_PATH --pyi_out=$OUT_PATH --grpc_python_out=$OUT_PATH inference_service.proto


# protoc --proto_path=../../services/inference-service/protos --python_out=../../services/inference-service/server inference_service.proto
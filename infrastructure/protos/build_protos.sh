#!/usr/bin/env bash
cd "${0%/*}"

cd ../../services
PY_OUT=inference_service/server
PROTO_PATH=protos/inference_service/server

python3.10 -m grpc_tools.protoc --proto_path=$PROTO_PATH --python_out=$PY_OUT --pyi_out=$PY_OUT --grpc_python_out=$PY_OUT inference_service.proto
#protol --create-package --in-place --python-out $PY_OUT protoc --proto-path=$PROTO_PATH inference_service.proto

exit 0
#!/usr/bin/env bash
cd "${0%/*}"

cd ../../services/
python3.10 -m grpc_tools.protoc --proto_path=protos --python_out=. --pyi_out=. --grpc_python_out=. inference_service/server/inference_service.proto

exit 0
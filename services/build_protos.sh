#!/usr/bin/env bash
cd "${0%/*}"

PY_OUT=inference_service/server
PROTO_PATH=protos/inference_service/server
TS_PATH=src/proto

python3.10 -m grpc_tools.protoc --proto_path=$PROTO_PATH --python_out=$PY_OUT --pyi_out=$PY_OUT \
--grpc_python_out=$PY_OUT inference_service.proto

cd app-service

yarn

protoc --plugin=protoc-gen-ts_proto=./node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=${TS_PATH} --ts_proto_opt=outputServices=grpc-js,env=node,esModuleInterop=true -I ../${PROTO_PATH} ../${PROTO_PATH}/inference_service.proto

echo "Built protos successfully."
exit 0

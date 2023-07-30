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
# yarn run grpc_tools_node_protoc \
#   --plugin=protoc-gen-grpc=./node_modules/.bin/grpc_tools_node_protoc_plugin \
#   --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
#   --js_out=import_style=commonjs,binary:./${TS_PATH} \
#   --ts_out=grpc_js:./${TS_PATH} \
#   --grpc_out=grpc_js:./${TS_PATH} \
#   --proto_path=../${PROTO_PATH} \
#   ../${PROTO_PATH}/inference_service.proto
exit 0

# protoc --js_out=import_style=commonjs,binary:./ --grpc_out=./ --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` wallet.proto
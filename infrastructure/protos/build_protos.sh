#!/usr/bin/env bash

cd "${0%/*}"
protoc --proto_path=../../services/inference-service/protos --python_out=../../services/inference-service/generated_protos inference_service.proto
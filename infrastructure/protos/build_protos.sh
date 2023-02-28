cd "${0%/*}"
protoc --proto_path=../../services/inference-service/protos --python_out=generated protos/inference_service.proto
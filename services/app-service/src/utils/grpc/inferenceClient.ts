import grpc from "@grpc/grpc-js";
import { InferenceServiceClient } from "../../proto/inference_service_grpc_pb.js";

export default new InferenceServiceClient(
  `dns:///inference-service:443`,
  grpc.credentials.createInsecure()
);

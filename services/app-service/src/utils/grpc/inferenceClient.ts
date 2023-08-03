import grpc from "@grpc/grpc-js";
import { InferenceServiceClient } from "../../proto/inference_service.js";

export default new InferenceServiceClient(
  process.env.INFERENCE_SERVICE_URL || "dns:///inference-service:443",
  grpc.credentials.createInsecure()
);

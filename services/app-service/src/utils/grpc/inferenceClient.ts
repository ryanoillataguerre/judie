import grpc from "@grpc/grpc-js";
import { InferenceServiceClient } from "../../proto/inference_service.js";
import { Environment, getEnv } from "../env.js";

export default new InferenceServiceClient(
  process.env.INFERENCE_SERVICE_URL || "dns:///inference-service:443",
  getEnv() === Environment.Local
    ? grpc.credentials.createInsecure()
    : grpc.credentials.createSsl()
);

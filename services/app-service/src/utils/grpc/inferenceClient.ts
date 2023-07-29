import { createChannel, createClient } from "nice-grpc";
import {
  InferenceServiceClient,
  InferenceServiceDefinition,
} from "../../proto/inference_service.js";

const channel = createChannel(`dns:///inference-service:443`);

const client: InferenceServiceClient = createClient(
  InferenceServiceDefinition,
  channel
);

export default client;

// import protoLoader from "@grpc/proto-loader";
// import grpc from "@grpc/grpc-js";
// import path from "path";

// const PROTO_PATH = path.join(
//   __dirname + "../../protos/inference_service/server/inference_service.proto"
// );

// const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
//   keepCase: true,
//   longs: String,
//   enums: String,
//   defaults: true,
//   oneofs: true,
// });

// export const inferenceProto =
//   grpc.loadPackageDefinition(packageDefinition).inferenceServiceServer;

// const inferenceServiceCLient = new inferenceProto.InferenceService(
//   "dns:///inference-service:443",
//   grpc.credentials.createInsecure()
// );

// export { inferenceServiceCLient };

import grpc from "@grpc/grpc-js";
import { InferenceServiceClient } from "../../proto/inference_service_grpc_pb.js";
export default new InferenceServiceClient(
  `dns:///inference-service:443`,
  grpc.credentials.createInsecure()
);

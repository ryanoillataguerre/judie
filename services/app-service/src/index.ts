import dotenv from "dotenv";
import server from "./server.js";
import { inferenceServiceCLient } from "./utils/grpc/client.js";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const port = process.env.PORT || 8080;

server().listen(port);

const client = inferenceServiceCLient();

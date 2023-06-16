import dotenv from "dotenv";
import server from "./server.js";
import { Environment, getEnv } from "./utils/env.js";

if (getEnv() === Environment.Local) {
  dotenv.config();
}

const port = process.env.PORT || 8080;

server().listen(port);

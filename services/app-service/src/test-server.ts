import dotenv from "dotenv";
import { Environment, getEnv } from "./utils/env.js";
import express from "express";
import http from "http";

const app = express();
const server = () => {
  const httpServer = http.createServer(app);

  httpServer.on("listening", () => {
    console.info(`app-service-test listening on port ${process.env.PORT}...`);
  });

  return httpServer;
};

if (getEnv() === Environment.Local) {
  dotenv.config();
}

const port = process.env.PORT || 8080;

server().listen(port);

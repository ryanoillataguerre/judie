import cookieParser from "cookie-parser";
import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import http from "http";
import { headers } from "./utils/express";

const app = express();

// Helpers
app.use(headers);
app.use(helmet());
app.use(cookieParser());

// Routes
// app.use(
//   "/",
//   express.json({
//     limit: "50mb",
//   }),
//   routes
// );
app.get("/health", (_: Request, res: Response) =>
  res.status(200).send({ success: true, service: "app-service" })
);
app.get("*", (_: Request, res: Response) => res.status(404).send("Not Found"));

// Fallback error handler
// app.use(errorHandler);

const server = () => {
  const httpServer = http.createServer(app);

  httpServer.on("listening", () => {
    console.info(`app-service listening on port ${process.env.SERVER_PORT}...`);
  });

  return httpServer;
};

export default server;

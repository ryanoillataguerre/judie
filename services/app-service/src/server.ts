import cookieParser from "cookie-parser";
import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import http from "http";
import router from "./router.js";
import webhookRoutes from "./payments/webhooks.js";
import {
  errorHandler,
  errorPassthrough,
  headers,
  morganLogger,
  sessionLayer,
} from "./utils/express.js";

const app = express();

// Helpers
app.use(headers);
app.use(helmet());
app.use(cookieParser());
app.use(sessionLayer());
app.use(morganLogger());
// Webhooks
app.use(
  "/webhooks",
  express.raw({
    limit: "50mb",
    type: "*/*",
  }),
  webhookRoutes
);
// Routes
app.use(
  "/",
  express.json({
    limit: "50mb",
  }),
  router
);
app.get(
  "/healthcheck",
  errorPassthrough((_: Request, res: Response) => res.sendStatus(200))
);
app.get(
  "*",
  errorPassthrough((_: Request, res: Response) => res.sendStatus(404))
);

// Fallback error handler
app.use(errorHandler);

const server = () => {
  const httpServer = http.createServer(app);

  httpServer.on("listening", () => {
    console.info(`app-service listening on port ${process.env.PORT}...`);
  });

  return httpServer;
};

export default server;

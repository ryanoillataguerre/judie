import dotenv from "dotenv";
import server from "./server";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const port = process.env.SERVER_PORT || 8080;

server().listen(port);

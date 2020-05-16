import express , { Express } from "express"
import Server from "./config/server";

const app : Express = express();
const server : Server = new Server(app);

server.configuration();
server.api("/api/v1");
server.run();
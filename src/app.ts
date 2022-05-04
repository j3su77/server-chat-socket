import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import cors from "cors"
import config from "config"
import logger from './utils/logger';

import { version } from "../package.json"
import socket from "./socket";
const port = config.get<number>("port")
const host = config.get<string>("host")
const corsOrigin = config.get<string>("corsOrigin")

const app = express()

const httpServer = createServer(app)

app.use(cors({
  origin: "*"
}))

const io = new Server(httpServer, {
    cors: {
      origin: "*",
      allowedHeaders: ["Access-Control-Allow-Origin"],
    },
  });

  


app.get("/", ( _, res) => res.send(`Server is up and version: ${version}`))

httpServer.listen(port, host, () => {
    logger.info(`Server version ${version} is listening...`)
    socket({ io });
})
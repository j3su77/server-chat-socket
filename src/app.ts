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

const app = express();

const httpServer = createServer(app);

app.use(cors({
  origin: "*",
  credentials: false
}))
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", '*'); //<--
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers",
'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json,Authorization');
  next();
});


const io = new Server(httpServer, {
    cors: {
      origin: "*",
  credentials: false

    },
  });



app.get("/", ( _, res) => res.send(`Server is up and version: ${version}`))

httpServer.listen(port, host, () => {
    logger.info(`Server version ${version} is listening...`)
    socket({ io });
})
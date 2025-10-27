import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { registerGameSocket } from "./sockets/gameSocket.js";

export const createApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const httpServer = createServer(app);

  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
    },
  });

  registerGameSocket(io);

  return { app, httpServer };
};

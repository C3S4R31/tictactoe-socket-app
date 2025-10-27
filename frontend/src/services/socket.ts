import { io, Socket } from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
console.log("🔌 Backend URL:", import.meta.env.VITE_BACKEND_URL);

export const socket: Socket = io(BACKEND_URL, {
  autoConnect: false,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});


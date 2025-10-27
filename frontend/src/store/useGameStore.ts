import { create } from "zustand";
import { socket } from "../services/socket";
import type { Socket } from "socket.io-client";



export type GameState = {
  socket: Socket,
  name: string,
  roomId: string,
  connected: boolean,
  setName: (value: string) => void,
  setRoom: (value: string) => void,
  setConnected: (value: boolean) => void,
}

export const useGameStore = create<GameState>((set) => ({
  socket,
  name: "",
  roomId:'',
  connected: false,
  setName: (value) => set(state => ({
    ...state,
    name: value
  })),
  setRoom: (value) => set(state => ({
    ...state,
    roomId: value
  })),
  setConnected: (value) => set(state => ({
    ...state,
    connected: value
  }))
}));



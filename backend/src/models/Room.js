import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  name: String,
  players: Object,
  board: [String],
  currentTurn: String,
  status: String,
  winner: String,
  draws: Number,
});

export const Room = mongoose.model("Room", roomSchema);

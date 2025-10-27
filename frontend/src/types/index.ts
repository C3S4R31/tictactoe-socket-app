export type Role = 'X' | 'O'
export type Board = null | 'X' | 'O'

export type Player = {
  name: string;
  role: Role;
  score: number;
};

export type GameRoom = {
  players: Record<string, Player>;
  board: Board[];
  currentTurn: Role;
  status: 'waiting' | 'playing' | 'end';
  winner: null | Role;
  draws: number;
};

export type GameRoomList = Pick<GameRoom,'status'> & {
  id: string,
  playerCount: number
};

//Responses
export type SocketResponse = {
  status: string,
  error?: string
  roomId?: string
  game?: GameRoom
}

export type SocketAdminResponse = {
  totalRooms: number,
  totalPlaying: number,
  totalWaiting: number,
  totalPlayers: number,
  topPlayer: string,
  maxScore: number,
}





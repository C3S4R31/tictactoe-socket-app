import { useEffect, useState } from "react";
import { useGameStore } from "../store/useGameStore";
import BoardCell from "../components/BoardCell";
import { IconCircle, IconX, IconRefresh } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import type { Board, GameRoom, Player, Role, SocketResponse } from "../types";

export default function GameOnline() {  

  const socket = useGameStore((state) => state.socket);
  const roomId = useGameStore((state) => state.roomId);  

  const [board, setBoard] = useState<Board[]>(Array(9).fill(null));
  const [player, setPlayer] = useState<string | null>(null);
  const [turn, setTurn] = useState<Role>("X");
  const [status, setStatus] = useState<string>("Esperando...");
  const [winner, setWinner] = useState<string | null>(null);
  const [players, setPlayers] = useState<GameRoom['players']>({});
  const [draws, setDraws] = useState<GameRoom['draws']>(0);

  const updateGameState = (game: GameRoom) => {
    if (!game) return;

    setBoard(game.board);
    setTurn(game.currentTurn);
    setWinner(game.winner);
    setDraws(game.draws);
    setPlayers(game.players);
    setStatus(
      game.status === "waiting"
        ? "Esperando otro jugador..."
        : game.status === "end"
        ? "Partida terminada"
        : ""
    );

    const myPlayer = game.players[socket.id!];
    if (myPlayer) setPlayer(myPlayer.role);
  };
 

  useEffect(() => { 
    
    console.log('ROOMID:',roomId)

    socket.emit("get_game_state", roomId, (res:SocketResponse) => {
      if (res.error) {
        console.error(res.error);
        return;
      }
      updateGameState(res.game!);
    });
    
    socket.on("board_update", updateGameState);

    return () => {
      socket.off("board_update", updateGameState);
    };
  }, [socket, roomId]);


  const handleClick = (index: number) => {
    if (!player) return;
    if (board[index]) return;
    if (turn !== player) return;

    socket.emit("make_move", {index, roomId});
  };

  const resetGame = () => {
    socket.emit("reset_game", roomId);
    setWinner(null);
  };

  const playerList = Object.values(players);
  const playerX = playerList.find((p: Player) => p.role === "X");
  const playerO = playerList.find((p: Player) => p.role === "O");  

  return (
    <div className="max-w-lg mx-auto flex flex-col items-center justify-center min-h-screen gap-6">
      <div className="flex">
        <IconX color="#00b8db" size={54} stroke={3} />
        <IconCircle color="#8e51ff" size={54} stroke={3} />
      </div>

      <h2 className="text-3xl font-bold">
        {winner === null
          ? "Sala de Juego"
          : winner === "draw"
          ? "¡Empate!"
          : `¡Ganó ${winner}!`}
      </h2>
      
      <h3 className="text-xl font-semibold">{status}</h3>

      <div className="w-full flex justify-between items-center px-2">
        <Link
          to="/rooms"
          className="w-24 p-2 bg-cyan-500 text-slate-900 text-md font-semibold rounded-xl flex items-center justify-center gap-2"
        >
          Volver
        </Link>

        {winner ? (
          <button
            onClick={resetGame}
            className="flex items-center gap-1 p-2 rounded-xl bg-gray-500 text-white hover:bg-gray-400 cursor-pointer"
          >
            <IconRefresh size={24} /> Reiniciar
          </button>
        ) : (
          <>          
            <div className="flex items-center gap-3 bg-slate-800 rounded-full px-4 py-1">
              <p className="text-xl">Eres</p>
              {player === "X" ? (
                <IconX color="#00b8db" size={24} stroke={3} />
              ) : (
                <IconCircle color="#8e51ff" size={24} stroke={3} />
              )}              
            </div>

            <div className="flex items-center gap-3 bg-slate-800 rounded-full px-4 py-1">
              <p className="text-xl">Turno</p>
              {turn === "X" ? (
                <IconX color="#00b8db" size={24} stroke={3} />
              ) : (
                <IconCircle color="#8e51ff" size={24} stroke={3} />
              )}
              
            </div>
          </>
        )}
      </div>

      <div className="w-full grid grid-cols-3 place-items-center gap-4">
        {board.map((cell, i) => (
          <BoardCell key={i} index={i} cell={cell} handleClick={handleClick} />
        ))}

        <div className="w-36 h-24 rounded-xl bg-cyan-500 flex flex-col items-center justify-center">
          <p className="text-slate-900">{playerX?.name ?? "Jugador X"}</p>
          <p className="text-slate-900 font-bold text-2xl">{playerX?.score ?? 0}</p>
        </div>

        <div className="w-36 h-24 rounded-xl bg-gray-400 flex flex-col items-center justify-center">
          <p className="text-slate-900">Empates</p>
          <p className="text-slate-900 font-bold text-2xl">{draws}</p>
        </div>

        <div className="w-36 h-24 rounded-xl bg-violet-500 flex flex-col items-center justify-center">
          <p className="text-slate-900">{playerO?.name ?? "Jugador O"}</p>
          <p className="text-slate-900 font-bold text-2xl">{playerO?.score ?? 0}</p>
        </div>

      </div>
    </div>
  );
}

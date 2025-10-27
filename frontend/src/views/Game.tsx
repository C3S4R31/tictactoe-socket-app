import { useState } from "react";
import BoardCell from "../components/BoardCell";
import { IconCircle, IconRefresh, IconX } from "@tabler/icons-react";
import { Link } from "react-router-dom";

const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

interface Score {
  player1: number;
  player2: number;
  draw: number;
}


export default function Game() {

  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [player, setPlayer] = useState("X");
  const [winner, setWinner] = useState<string | null>(null);
  const [score, setScore] = useState<Score>({
    player1: 0,
    player2: 0,
    draw: 0,
  });


  
  const checkWinner = (newBoard: (string | null)[]) => {
    for (let combo of winningCombos) {
      const [a, b, c] = combo;
      if (
        newBoard[a] &&
        newBoard[a] === newBoard[b] &&
        newBoard[a] === newBoard[c]
      ) {
        return newBoard[a];
      }
    }
    if (newBoard.every((cell) => cell !== null)) return "draw";
    return null;
  };

  function updateScore(value: string) {
    const winner = value === "draw" ? "draw" : value === "X" ? "player1" : "player2";
    setScore((prev) => ({
      ...prev,
      [winner]: prev[winner] + 1,
    }));
  }

  const handleClick = (index: number) => {
    if (board[index] || winner ) return;

    const newBoard = [...board];
    newBoard[index] = player;
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result);
      updateScore(result);       
    } else {
      setPlayer(player === "X" ? "O" : "X");
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setPlayer("X");
  };

  return (
    <div className="max-w-lg mx-auto flex flex-col items-center justify-center min-h-screen gap-6">
      <div className="flex">
        <IconX color="#00b8db" size={54} stroke={3} />
        <IconCircle color="#8e51ff" size={54} stroke={3} /> 
      </div>
      <h2 className="text-3xl font-bold">{winner === null ? "Sala de Juego" : winner === "draw" ? "¡Empate!" : `¡Ganó ${winner}!`}</h2>

      <div className="w-full flex justify-between items-center px-2">       

        <Link
          to="/"
          className="w-24 p-2 bg-cyan-500 text-slate-900 text-md font-semibold rounded-xl flex items-center justify-center gap-2"
        >Volver</Link>   

        {winner ?
          <button
              onClick={resetGame}
              className="flex items-center gap-1 p-2 rounded-xl bg-gray-500 text-white hover:bg-gray-400 cursor-pointer"
            ><IconRefresh size={24} />Reiniciar</button>
            :
            <div className="flex items-center gap-3 bg-slate-800 rounded-full px-4 py-1 ">
              {player === 'X' ? (
                  <IconX color="#00b8db" size={24} stroke={3} />
                ) : (
                  <IconCircle color="#8e51ff" size={24} stroke={3} />              
                )}
              <p className="text-xl">Turno</p>
            </div>          
        }
      </div>

      <div className="w-full grid grid-cols-3 place-items-center gap-4">
        {board.map((cell, index) => (
          <BoardCell 
            key={index}
            index={index}
            cell={cell}
            handleClick={handleClick}
          />          
        ))}

        <div className="w-36 h-24 rounded-xl bg-cyan-500 flex flex-col items-center justify-center">
          <p className="text-slate-900">Jugador X</p>
          <p className="text-slate-900 font-bold text-2xl">{score.player1}</p>          
        </div>

        <div className="w-36 h-24 rounded-xl bg-gray-400 flex flex-col items-center justify-center">
          <p className="text-slate-900">Empates</p>
          <p className="text-slate-900 font-bold text-2xl">{score.draw}</p>          
        </div>

        <div className="w-36 h-24 rounded-xl bg-violet-500 flex flex-col items-center justify-center">
          <p className="text-slate-900">Jugador O</p>
          <p className="text-slate-900 font-bold text-2xl">{score.player2}</p>          
        </div>
      </div>  
    </div>
  )
}

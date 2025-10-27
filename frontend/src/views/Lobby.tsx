import { Link, useNavigate } from "react-router-dom";
import { useGameStore } from "../store/useGameStore";
import { IconDeviceDesktop, IconUsersGroup, IconList, IconShield } from "@tabler/icons-react";
import { toast } from "react-toastify";
import type { SocketResponse } from "../types";
import { useEffect } from "react";


export default function Lobby() {

  const navigate = useNavigate();
  
  const connected = useGameStore((state) => state.connected);
  const socket = useGameStore((state) => state.socket);
  const name = useGameStore((state) => state.name);
  const setRoom = useGameStore((state) => state.setRoom);
  const setName = useGameStore((state) => state.setName);

  const handleSetName = () => {
    setName(name); 
  }; 

  const handleClick = () => {
    handleSetName();
    socket.emit("create_room", { name }, (res:SocketResponse) => {
      if (res.error) {
        toast.error(res.error);
        return;
      }
      setRoom(res.roomId!);
      toast.success("Sala creada, esperando oponente...");
      navigate("/gameOnline");
    });    
  }  

  useEffect(() => {
    setName('');
  },[])

  return (
    <>
      <div className="max-w-lg w-full flex flex-col items-center gap-4 bg-slate-800 rounded-xl p-8">        
        <input
          className="w-full p-3 border border-slate-600 bg-slate-900 rounded-lg shadow-sm text-center focus:ring-2 focus:ring-cyan-500"
          placeholder="Ingresa tu nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Link
          to="/game"
          onClick={handleSetName}
          className="w-full px-8 py-3  bg-cyan-500 text-slate-900 text-md font-semibold rounded-xl flex items-center justify-center gap-2"
        >
          <IconDeviceDesktop size={18} />
          Jugar Localmente
        </Link>

        <button
          onClick={handleClick}
          className={`w-full px-8 py-3  bg-violet-500 text-slate-900 text-md font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer ${name === '' || name === 'admin' || !connected ? "pointer-events-none opacity-50" : ""}`}
        >
          <IconUsersGroup size={18} />
          Jugar Online
        </button>

        <Link
          to="/rooms"
          onClick={handleSetName}
          className={`w-full px-8 py-3 border border-slate-600 bg-slate-900 text-white text-md font-semibold rounded-xl flex items-center justify-center gap-2 ${name === '' || name === 'admin' || !connected ? "pointer-events-none opacity-50" : ""}`}
        >
          <IconList size={18} />          
          Ver Salas Disponibles
        </Link>

        <Link
          to="/admin"
          onClick={handleSetName}
          className={`w-full px-8 py-3 border border-slate-600 bg-slate-900 text-white text-md font-semibold rounded-xl flex items-center justify-center gap-2 ${name !== 'admin' || !connected ? "pointer-events-none opacity-50" : ""}`}
        >
          <IconShield size={18} />          
          Panel de Administracion
        </Link>
      </div>
    </>
  );
}

import { IconUsers, IconActivity, IconTarget, IconClock, IconTrophy, IconAward, IconListCheck } from "@tabler/icons-react";
import AdminCard from "../components/AdminCard";
import { useEffect, useState } from "react";
import { useGameStore } from "../store/useGameStore";
import type { SocketAdminResponse } from "../types";
import { Link } from "react-router-dom";

export default function Admin() {

  const initialValue = {
    totalRooms: 0,
    totalPlaying: 0,
    totalWaiting: 0,
    totalPlayers: 0,
    topPlayer: '',
    maxScore: 0,
}

  const socket = useGameStore(state => state.socket);
  const [stats,setStats] = useState<SocketAdminResponse>(initialValue)

  const loadStats = () => {
    
    socket.emit("get_stats", (res: SocketAdminResponse ) => {
      console.log(res);
      setStats(res);
    });
  }

  useEffect(() => {   
    
    loadStats();
    
    console.log('FUNCION LLAMADA');

    socket.on("rooms_updated", loadStats);

    return () => {
      socket.off("rooms_updated", loadStats)
    }   
      
  }, [socket]);


  return (
    <div className="max-w-7xl w-full self-stretch flex flex-col items-center gap-4 py-8 px-4">
      <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
        Panel de Administración
      </h2>

      <Link
        to={'/'}          
        className="px-10 py-2 border border-slate-600 bg-slate-900 text-white text-md font-semibold rounded-xl flex items-center justify-center gap-2"
      >Volver al Lobby</Link>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">

          <AdminCard 
            icon={IconActivity}
            color="#00b8db"
            title="Estado del Servidor" 
            count={socket.connected ? "En linea" : "Desconectado"}
          />

          <AdminCard 
            icon={IconListCheck}
            color="#8e51ff"
            title="Salas Activas" 
            count={stats?.totalRooms!}
          />
          <AdminCard
            icon={IconUsers}
            color="#00b8db"
            title="Jugadores Conectados"
            count={stats?.totalPlayers!}
          />
          <AdminCard
            icon={IconTarget}
            color="#8e51ff"
            title="Partidas en Curso"
            count={stats?.totalPlaying!}
          />
          <AdminCard
            icon={IconClock}
            color="#00b8db"
            title="Partidas en espera"
            count={stats?.totalWaiting!}
          />

          <AdminCard
            icon={IconTrophy}
            color="#8e51ff"
            title="Jugador con más victorias"
            count={stats?.topPlayer!}
          />

          <AdminCard
            icon={IconAward}
            color="#00b8db"
            title="Cantidad de partidas ganadas"
            count={stats?.maxScore!}
          />
        </div>
    </div>
  );
}

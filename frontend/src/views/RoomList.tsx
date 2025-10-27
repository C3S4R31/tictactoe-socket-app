import { useEffect, useState } from "react";
import { useGameStore } from "../store/useGameStore";
import { type GameRoomList, type SocketResponse } from '../types/index';
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


export default function RoomList() {

  const navigate = useNavigate();

  const socket = useGameStore(state => state.socket);
  const name = useGameStore(state => state.name);
  const roomId  = useGameStore(state => state.roomId);
  const setRoom  = useGameStore(state => state.setRoom);
  
  const [rooms, setRooms] = useState<GameRoomList[]>([]);
  

  const handleJoinRoom = ({name, roomId}:{name:string, roomId: string}) => {

    socket.emit("join_game", {name, roomId}, (res: SocketResponse) => {
      if(res.error){
        toast.error(res.error)
        return;
      }     
      setRoom(roomId);
      toast.success(res.status);
      navigate("/gameOnline");    
    });

  }

  const loadRooms = () => {
    socket.emit("get_rooms", (res: GameRoomList[] ) => {
      console.log(res)
      setRooms(res);
    });
  }

  const leaveRoom = (roomId:string) => {
    if(roomId !== ''){
      socket.emit("quit_game", roomId, () => {
        setRoom('');                
      });
      return;
    }     
    loadRooms()     
  }

  useEffect(() => {

    leaveRoom(roomId);

    socket.on("rooms_updated", loadRooms);

    return () => {
      socket.off("rooms_updated", loadRooms)
    }   
      
  }, [socket]);  

  return (
    <div className="max-w-xl w-full self-stretch flex flex-col items-center gap-4 p-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
        Salas Disponibles
      </h2>

      <Link
        to={'/'}          
        className="px-10 py-2 border border-slate-600 bg-slate-900 text-white text-md font-semibold rounded-xl flex items-center justify-center gap-2"
      >Volver al Lobby</Link>

      <div className="w-full flex flex-col gap-4">
        {rooms.length === 0 ? (
          <p className="text-center m-6">No hay Salas</p>
        ) : (
          <>
            {rooms.map((room) => (
              <div key={room.id} className="p-6 bg-card rounded-md bg-slate-800 border border-slate-500">
                <div className="flex items-center justify-between flex-col gap-4 sm:flex-row ">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-2 text-center sm:text-start">
                      {room.id}
                    </h3>
                    <p className="text-muted-foreground">
                      Jugadores: {room.playerCount}/2
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleJoinRoom({name, roomId: room.id})}                 
                    className="min-w-[120px] px-4 py-2 bg-cyan-500 text-slate-900 text-md font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                  >Unirse</button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
               
          

          
    </div>
  );

  

  
}

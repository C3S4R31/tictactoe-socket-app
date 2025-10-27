import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useGameStore } from "../store/useGameStore";


export default function AppLayout() {  

  const navigate = useNavigate();

  const socket = useGameStore((state) => state.socket);
  const setConnected = useGameStore((state) => state.setConnected);

  useEffect(() => {
    try {
      socket.connect();

      socket.on("connect", () => {
        console.log("✅ Server Connected");
        setConnected(true);        
      });      

      socket.on("disconnect", () => {
        toast.error("⚠️ Desconectado del servidor");
        setConnected(false);
        navigate('/');
      });
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
    }

    return () => {
      socket.disconnect();
    };
  }, []);


  return (
    <>
      <ToastContainer pauseOnHover={false} pauseOnFocusLoss={false} />
      <div className="min-h-screen h-full flex flex-col bg-slate-900 text-white">

        <header className="max-w-4xl w-full mx-auto px-4 py-10">
          <h1 className="text-5xl font-bold text-center bg-linear-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">
            TIC TAC TOE
          </h1>
        </header>

        <main className="w-full flex flex-1 items-center justify-center overflow-y-auto">
          <Outlet />          
        </main>
      </div>      
    </>
  );
}

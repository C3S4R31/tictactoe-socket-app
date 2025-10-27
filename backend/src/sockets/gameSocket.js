import { Room } from "../models/Room.js";
import { checkWinner } from "../utils/checkWinner.js";

export const registerGameSocket = (io) => {

  io.on("connection", (socket) => {

    console.log("🎮 Cliente conectado:", socket.id);

    // Obtener salas
    socket.on("get_rooms", async (callback) => {
        const rooms = await Room.find({ status: "waiting" });
        const formatted = rooms.map((room) => ({
        id: room.name,
        playerCount: Object.keys(room.players).length,
        status: room.status,
        }));
        callback(formatted);
    });

    // Obtener estadísticas
    socket.on("get_stats", async (callback) => {
        const rooms = await Room.find();
        const totalRooms = rooms.length;
        const totalPlaying = rooms.filter((r) => r.status === "playing").length;
        const totalWaiting = rooms.filter((r) => r.status === "waiting").length;

        let topPlayer = null;
        let maxScore = 0;
        for (const room of rooms) {
        for (const player of Object.values(room.players)) {
            if (player.score > maxScore) {
            maxScore = player.score;
            topPlayer = player.name;
            }
        }
        }

        callback({
        totalRooms,
        totalPlaying,
        totalWaiting,
        totalPlayers: io.sockets.sockets.size - 1,
        topPlayer: topPlayer || "N/A",
        maxScore,
        });
    });

    // Crear sala
    socket.on("create_room", async ({ name }, callback) => {
        const totalRooms = await Room.countDocuments();
        const roomId = `Sala ${totalRooms + 1}`;

        const newRoom = new Room({
        name: roomId,
        players: {
            [socket.id]: { role: "X", name, score: 0 },
        },
        board: Array(9).fill(null),
        currentTurn: "X",
        status: "waiting",
        winner: null,
        draws: 0,
        });

        await newRoom.save();

        socket.join(roomId);
        console.log(`🆕 Sala creada: ${roomId} por ${name}`);

        callback({ status: "Sala creada", roomId });
        io.emit("rooms_updated");
    });

    // Entrar a sala
    socket.on("join_game", async ({ name, roomId }, callback) => {
        try {
        const room = await Room.findOne({ name: roomId });
        if (!room) {
            callback({ error: "No existe la sala" });
            return;
        }

        const playerCount = Object.keys(room.players || {}).length;
        if (playerCount >= 2) {
            callback({ error: "Sala llena" });
            return;
        }

        const roleXExists = Object.values(room.players || {}).some(p => p.role === "X");
        const role = roleXExists ? "O" : "X";

        room.players[socket.id] = { role, name, score: 0 };

        room.markModified("players");

        room.status = Object.keys(room.players).length === 2 ? "playing" : "waiting";

        await room.save();

        socket.join(roomId);
        callback({ status: "Uniéndose a la partida..." });

        io.to(roomId).emit("board_update", room);
        io.emit("rooms_updated");
        } catch (err) {
        console.error("Error en join_game:", err);
        callback({ error: "Error interno del servidor" });
        }
    });



    // Obtener estado del juego
    socket.on("get_game_state", async (roomId, callback) => {
        const room = await Room.findOne({ name: roomId });
        if (!room) {
        callback({ error: "La sala no existe" });
        return;
        }

        callback({ status: "Datos enviados", game: room });

    });

    // Jugada
    socket.on("make_move", async ({ index, roomId }) => {
        const room = await Room.findOne({ name: roomId });
        if (!room) return;

        const player = room.players[socket.id];
        if (!player) return;
        if (room.board[index] !== null) return;
        if (player.role !== room.currentTurn) return;
        if (room.status !== "playing") return;

        room.board[index] = player.role;
        const result = checkWinner(room.board);

        if (result) {
        room.winner = result;
        room.status = "end";
        if (result === "draw") {
            room.draws += 1;
        } else {
            const winnerPlayer = Object.values(room.players).find((p) => p.role === result);
            if (winnerPlayer) winnerPlayer.score += 1;
        }

        room.markModified("players");
        } else {
        room.currentTurn = player.role === "X" ? "O" : "X";
        }

        await room.save();

        io.to(roomId).emit("board_update", room);
        io.emit("rooms_updated");
    });


    // Resetear juego
    socket.on("reset_game", async (roomId) => {
        const room = await Room.findOne({ name: roomId });
        if (!room) return;

        room.board = Array(9).fill(null);
        room.currentTurn = Math.random() < 0.5 ? "X" : "O";
        room.winner = null;
        room.status = Object.keys(room.players).length < 2 ? "waiting" : "playing";

        await room.save();
        io.to(roomId).emit("board_update", room);
        io.emit("rooms_updated");
    });

    // Salir del juego
    socket.on("quit_game", async (roomId, callback) => {
        try {
        const room = await Room.findOne({ name: roomId });
        if (!room) {
            callback({ error: "No existe la sala" });
            return;
        }

        delete room.players[socket.id];

        room.markModified("players");

        if (Object.keys(room.players).length === 0) {
            await Room.deleteOne({ name: roomId });
            console.log(`🗑️ Sala eliminada: ${roomId}`);
        } else {
            room.status = "waiting";
            room.board = Array(9).fill(null);
            room.winner = null;
            await room.save();
        }

        callback({ status: "Saliendo de la sala..." });
        io.emit("rooms_updated");
        } catch (err) {
        console.error("Error en quit_game:", err);
        callback({ error: "Error interno del servidor" });
        }
    });


    // Desconexión
    socket.on("disconnect", async () => {
        try {
        console.log(`❌ ${socket.id} se desconectó`);
        const rooms = await Room.find();

        for (const room of rooms) {
            if (room.players[socket.id]) {
            delete room.players[socket.id];
            room.markModified("players"); 
            
            if (Object.keys(room.players).length === 0) {
                await Room.deleteOne({ name: room.name });
                console.log(`🗑️ Sala eliminada: ${room.name}`);
            } else {
                room.status = "waiting";
                room.board = Array(9).fill(null);
                room.currentTurn = "X";
                room.winner = null;
                await room.save();

                io.to(room.name).emit("board_update", room);
            }
            }
        }

        io.emit("rooms_updated");
        } catch (err) {
        console.error("Error en disconnect:", err);
        }
    });

    
  });
};

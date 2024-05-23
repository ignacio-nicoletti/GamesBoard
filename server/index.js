import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { distribute, shuffle } from "./functions/functions.js";

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});

const games = {
  Berenjena: {},
  Poker: {},
  Truco: {},
  Generala: {},
};

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id} to server`);

  socket.on("get_all_rooms_info", ({ game }) => {
    const rooms = games[game];
    if (rooms) {
      const allRoomsInfo = Object.keys(rooms).map((roomId) => ({
        roomId,
        users: rooms[roomId].users,
        gameStarted: rooms[roomId].gameStarted,
      }));
      socket.emit("all_rooms_info", allRoomsInfo);
    } else {
      socket.emit("error", { error: "Invalid game" });
    }
  });

  socket.on("join_room", ({ game, roomId, userName }) => {
    const rooms = games[game];
    if (!rooms) {
      socket.emit("error", { error: "Invalid game" });
      return;
    }

    if (!rooms[roomId]) {
      rooms[roomId] = { users: [], gameStarted: false };
    } else if (rooms[roomId].users.length >= 6) {
      socket.emit("room_full", { error: "Room is full" });
      return;
    }

    if (rooms[roomId].gameStarted) {
      socket.emit("error", { error: "Game already started, cannot join" });
      return;
    }

    if (rooms[roomId].users.some((user) => user.id === socket.id)) {
      socket.emit("room_join_error", { error: "User already in the room" });
      return;
    }

    console.log(`User ${userName} joined room ${roomId} in game ${game}`);
    socket.join(`${game}-${roomId}`);
    const position = rooms[roomId].users.length + 1;
    const user = {
      id: socket.id,
      userName: userName,
      ready: false,
      roomId: roomId,
      position: position,
    };
    rooms[roomId].users.push(user);

    // Emitir el evento 'room_joined' al usuario actual
    socket.emit("room_joined", { roomId, position,userName });
    // Emitir la lista de jugadores actualizada a todos los usuarios en la sala
    io.to(`${game}-${roomId}`).emit("player_list", rooms[roomId].users);
  });

  socket.on("player_ready", ({ game, roomId }) => {
    console.log(`Player ready in room ${roomId} of game ${game}`);
    const rooms = games[game];
    if (rooms && rooms[roomId]) {
      const user = rooms[roomId].users.find((u) => u.id === socket.id);
      if (user) {
        user.ready = true;
        io.to(`${game}-${roomId}`).emit("player_list", rooms[roomId].users);
        // Verificar si todos los jugadores están listos y hay al menos 2 jugadores
        const allReady = rooms[roomId].users.every((u) => u.ready);
        const enoughPlayers = rooms[roomId].users.length >= 2;
        if (allReady && enoughPlayers) {
          rooms[roomId].gameStarted = true;
          io.to(`${game}-${roomId}`).emit("start_game", rooms[roomId].users);
        }
      }
    }
  });

  socket.on("distribute", ({ game, round, roomId, data }) => {

    // Verificar si roomId y roomId están definidos
    if (!roomId) {
        console.error("Invalid roomId object:", roomId);
        socket.emit("error", { error: "Invalid roomId object" });
        return;
    }

    try {
        let deck = distribute(); // Función para obtener el mazo
        let cartasMezcladas = shuffle(deck); // Función para mezclar las cartas

        const numPlayers = data.length;
        const cardsPerPlayer = round.cardXRound;

        // Calcular cuántas cartas debe recibir cada jugador en total
        const totalCardsToDistribute = numPlayers * cardsPerPlayer;

        // Verificar si hay suficientes cartas para distribuir
        if (cartasMezcladas.length < totalCardsToDistribute) {
            console.error("Not enough cards to distribute.");
            socket.emit("error", { error: "Not enough cards to distribute" });
            return;
        }

        let distributedCards = {};

        // Iterar sobre los jugadores y asignarles las cartas correspondientes
        for (let i = 0; i < numPlayers; i++) {
            // const playerId = data[i].id;
            distributedCards[`jugador${i + 1}`] = [];

            for (let j = 0; j < cardsPerPlayer; j++) {
                const card = cartasMezcladas.pop(); // Tomar la última carta del mazo (ya que está mezclado)
                distributedCards[`jugador${i + 1}`].push(card);
            }
        }

    
        io.to(`${game}-${roomId}`).emit("distribute", distributedCards);
        // No emitimos las cartas aquí, sino que retornamos los datos para manejarlos de manera adecuada en el cliente
        // return distributedCards;
    } catch (error) {
        console.error("Error in distribute function:", error);
        socket.emit("error", { error: "Error in distribute function" });
    }
});

    

  socket.on("disconnectRoom", () => {
    for (const game in games) {
      const rooms = games[game];
      for (const roomId in rooms) {
        const userIndex = rooms[roomId].users.findIndex(
          (user) => user.id === socket.id
        );
        if (userIndex !== -1) {
          rooms[roomId].users.splice(userIndex, 1);
          io.to(`${game}-${roomId}`).emit("player_list", rooms[roomId].users);
          if (rooms[roomId].users.length === 0) {
            delete rooms[roomId];
            console.log(`User ${socket.id} Disconnected from room =>${roomId}`);
          }
          break;
        }
      }
    }
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} Desconectado del servidor`);
  });
});

server.listen(3001, () => {
  console.log("Server listening on port 3001");
});

// Probar sala full
// Readys for start game
// repartir

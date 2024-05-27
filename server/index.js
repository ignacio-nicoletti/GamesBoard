import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { distribute, shuffle } from "./functions/functions.js"; // Asegúrate de que estas funciones estén definidas en el archivo adecuado

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});

const games = {
  Berenjena: createRooms(10),
  Poker: createRooms(10),
  Truco: createRooms(10),
  Generala: createRooms(10),
};

const permanentRooms = {
  Berenjena: createRooms(10),
  Poker: createRooms(10),
  Truco: createRooms(10),
  Generala: createRooms(10),
};

function createRooms(numberOfRooms) {
  const rooms = {};
  for (let i = 1; i <= numberOfRooms; i++) {
    rooms[i] = { users: [], gameStarted: false };
  }
  return rooms;
}

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id} to server`);

  socket.on("get_all_rooms_info", ({ game }) => {
    const rooms = games[game];
    if (rooms) {
      const allRoomsInfo = Object.keys(rooms).map((roomId) => ({
        roomId: Number(roomId),
        users: rooms[roomId].users,
        gameStarted: rooms[roomId].gameStarted,
        maxUsers: rooms[roomId].maxUsers || 6,
      }));
      socket.emit("all_rooms_info", allRoomsInfo);
    } else {
      socket.emit("error", { error: "Invalid game" });
    }
  });

  socket.on("join_room", ({ game, roomId, userName, selectedAvatar }) => {
    const rooms = games[game];
    if (!rooms) {
      socket.emit("error", { error: "Invalid game" });
      return;
    }

    if (!rooms[roomId]) {
      socket.emit("room_join_error", { error: "Room does not exist" });
      return;
    }

    const room = rooms[roomId];
    const maxUsers = room.maxUsers || 6;

    if (room.users.length >= maxUsers) {
      socket.emit("room_join_error", { error: "Room is full" });
      return;
    }

    if (room.gameStarted) {
      socket.emit("room_join_error", {
        error: "Game already started, cannot join",
      });
      return;
    }

    if (room.users.some((user) => user.id === socket.id)) {
      socket.emit("room_join_error", { error: "User already in the room" });
      return;
    }

    const user = {
      id: socket.id,
      userName,
      roomId,
      position: room.users.length + 1,
      ready: false,
      selectedAvatar,
    };
    room.users.push(user);

    console.log(`User ${userName} joined room ${roomId} in game ${game}`);
    socket.join(`${game}-${roomId}`);
    socket.emit("room_joined", { roomId, position: user.position, userName });
    io.to(`${game}-${roomId}`).emit("player_list", room.users);
  });

  socket.on(
    "create_room",
    ({ game, roomId, userName, maxUsers = 6, selectedAvatar }) => {
      const rooms = games[game];
      if (!rooms) {
        socket.emit("error", { error: "Invalid game" });
        return;
      }

      if (rooms[roomId]) {
        socket.emit("room_creation_error", { error: "Room already exists" });
        return;
      }

      rooms[roomId] = { users: [], gameStarted: false, maxUsers };

      const user = {
        id: socket.id,
        userName,
        roomId,
        position: rooms[roomId].users.length + 1,
        ready: false,
        selectedAvatar,
      };
      rooms[roomId].users.push(user);

      console.log(
        `Room ${roomId} created by ${userName} in game ${game} with max ${maxUsers} users`
      );
      socket.join(`${game}-${roomId}`);
      socket.emit("room_created", {
        roomId,
        position: user.position,
        userName,
        maxUsers,
      });

      io.to(`${game}-${roomId}`).emit("player_list", rooms[roomId].users);
    }
  );

  socket.on("disconnect", () => {
    Object.keys(games).forEach((game) => {
      Object.values(games[game]).forEach((room) => {
        const index = room.users.findIndex((user) => user.id === socket.id);
        if (index !== -1) {
          room.users.splice(index, 1);
          io.to(`${game}-${room.roomId}`).emit("player_list", room.users);
        }
      });
    });

    for (const game in games) {
      const rooms = games[game];
      for (const roomId in rooms) {
        const userIndex = rooms[roomId].users.findIndex(
          (user) => user.id === socket.id
        );
        if (userIndex !== -1) {
          rooms[roomId].users.splice(userIndex, 1);
          io.to(`${game}-${roomId}`).emit("player_list", rooms[roomId].users);
          if (
            rooms[roomId].users.length === 0 &&
            !permanentRooms[game][roomId]
          ) {
            delete rooms[roomId];
            console.log(`User ${socket.id} Disconnected from room =>${roomId}`);
          }
          break;
        }
      }
    }
  });

  socket.on("disconnectRoom", () => {
    let roomDisconnected = false;
    for (const game in games) {
      const rooms = games[game];
      for (const roomId in rooms) {
        const userIndex = rooms[roomId].users.findIndex(
          (user) => user.id === socket.id
        );
        if (userIndex !== -1) {
          rooms[roomId].users.splice(userIndex, 1);
          io.to(`${game}-${roomId}`).emit("player_list", rooms[roomId].users);
          if (
            rooms[roomId].users.length === 0 &&
            !permanentRooms[game][roomId]
          ) {
            delete rooms[roomId];
            roomDisconnected = true;
            console.log(`User ${socket.id} Disconnected from room =>${roomId}`);
          }
          break;
        }
      }
      if (roomDisconnected) break; // Salir del bucle exterior si se desconectó de una sala
    }
  });

  socket.on("player_ready", ({ game, roomId }) => {
    console.log(`Player ready in room ${roomId} of game ${game}`);
    const rooms = games[game];
    if (rooms && rooms[roomId]) {
      const user = rooms[roomId].users.find((u) => u.id === socket.id);
      if (user) {
        user.ready = true;
        io.to(`${game}-${roomId}`).emit("player_list", rooms[roomId].users);
        // Verificar si todos los jugadores están listos y el número de jugadores coincide con maxUsers
        const allReady = rooms[roomId].users.every((u) => u.ready);
        const maxUsers = rooms[roomId].maxUsers || 6;
        const correctNumberOfPlayers = rooms[roomId].users.length === maxUsers;
        if (allReady && correctNumberOfPlayers) {
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
        distributedCards[`jugador${i + 1}`] = [];

        for (let j = 0; j < cardsPerPlayer; j++) {
          const card = cartasMezcladas.pop(); // Tomar la última carta del mazo (ya que está mezclado)
          distributedCards[`jugador${i + 1}`].push(card);
        }
      }

      io.to(`${game}-${roomId}`).emit("distribute", distributedCards);
    } catch (error) {
      console.error("Error in distribute function:", error);
      socket.emit("error", { error: "Error in distribute function" });
    }
  });
});

server.listen(3001, () => {
  console.log("Server listening on port 3001");
});

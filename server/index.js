import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { barajar, shuffle } from "./functions/functions.js";

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
        gameStarted: rooms[roomId].gameStarted
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
      name: userName,
      ready: false,
      room: roomId,
      position: position,
    };
    rooms[roomId].users.push(user);

    socket.emit("position", position);
    io.to(`${game}-${roomId}`).emit("player_list", rooms[roomId].users);
    socket.emit("room_joined", { roomId, game, userName, position: position });
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
                io.to(`${game}-${roomId}`).emit("start_game");
            }
        }
    }
  });

  socket.on("barajar", ({ game, roomId, ronda }) => {
    let baraja = barajar();
    let cartasMezcladas = shuffle(baraja);

    const rooms = games[game];
    if (rooms && rooms[roomId] && rooms[roomId].users.length === 4) {
      if (ronda.cardPorRonda === 1) {
        io.to(`${game}-${roomId}`).emit("mezcladas", {
          jugador1: [cartasMezcladas[0]],
          jugador2: [cartasMezcladas[1]],
          jugador3: [cartasMezcladas[2]],
          jugador4: [cartasMezcladas[3]],
        });
      } else if (ronda.cardPorRonda === 3) {
        io.to(`${game}-${roomId}`).emit("mezcladas", {
          jugador1: cartasMezcladas.slice(0, 3),
          jugador2: cartasMezcladas.slice(3, 6),
          jugador3: cartasMezcladas.slice(6, 9),
          jugador4: cartasMezcladas.slice(9, 12),
        });
      } else if (ronda.cardPorRonda === 5) {
        io.to(`${game}-${roomId}`).emit("mezcladas", {
          jugador1: cartasMezcladas.slice(0, 5),
          jugador2: cartasMezcladas.slice(5, 10),
          jugador3: cartasMezcladas.slice(10, 15),
          jugador4: cartasMezcladas.slice(15, 20),
        });
      } else if (ronda.cardPorRonda === 7) {
        io.to(`${game}-${roomId}`).emit("mezcladas", {
          jugador1: cartasMezcladas.slice(0, 7),
          jugador2: cartasMezcladas.slice(7, 14),
          jugador3: cartasMezcladas.slice(14, 21),
          jugador4: cartasMezcladas.slice(21, 28),
        });
      }
    } else {
      socket.emit("error", {
        error: "Room not found or invalid number of players",
      });
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
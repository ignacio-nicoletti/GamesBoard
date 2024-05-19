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
      const allRoomsInfo = Object.keys(rooms).map(roomId => ({
        roomId,
        users: rooms[roomId]
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
      rooms[roomId] = [];
    }

    if (rooms[roomId].length < 6) {
      console.log(`User ${userName} joined room ${roomId} in game ${game}`);
      socket.join(`${game}-${roomId}`);

      const user = { id: socket.id, name: userName, ready: false, room: roomId };
      rooms[roomId].push(user);

      const position = rooms[roomId].length;
      socket.emit("position", position);
      io.to(`${game}-${roomId}`).emit("player_list", rooms[roomId]);
    } else {
      socket.emit("room_full", { error: "Room is full" });
    }
  });

  socket.on("player_ready", ({ game, roomId }) => {
    const rooms = games[game];
    if (rooms && rooms[roomId]) {
      const user = rooms[roomId].find(u => u.id === socket.id);
      if (user) {
        user.ready = true;

        io.to(`${game}-${roomId}`).emit("player_list", rooms[roomId]);

        const allReady = rooms[roomId].every(u => u.ready);
        if (allReady || rooms[roomId].length === 6) {
          io.to(`${game}-${roomId}`).emit("start_game");
        }
      }
    }
  });

  socket.on("barajar", ({ game, roomId, ronda }) => {
    let baraja = barajar();
    let cartasMezcladas = shuffle(baraja);

    const rooms = games[game];
    if (rooms && rooms[roomId] && rooms[roomId].length === 4) {
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
      socket.emit("error", { error: "Room not found or invalid number of players" });
    }
  });

  socket.on("disconnectRoom", () => {
    console.log(`User ${socket.id} Disconnected`);
    for (const game in games) {
      const rooms = games[game];
      for (const roomId in rooms) {
        const userIndex = rooms[roomId].findIndex(user => user.id === socket.id);
        if (userIndex !== -1) {
          rooms[roomId].splice(userIndex, 1);
          io.to(`${game}-${roomId}`).emit("player_list", rooms[roomId]);
          if (rooms[roomId].length === 0) {
            delete rooms[roomId];
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
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});

const users = [];

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('join_room', ({ roomId, userName }) => {
    console.log(`User ${userName} joined room ${roomId}`);
    socket.join(`room-${roomId}`);
    
    const user = { id: socket.id, name: userName };
    users.push(user);

    // Obtener la posición del usuario en la sala
    const position = users.length;
    // Enviar la posición del usuario de vuelta al cliente
    socket.emit('position', position);

    // Emitir la lista de jugadores actualizada a todos los clientes en la sala
    const playerList = users.map((user, index) => ({ position: index + 1, userName: user.name }));
    io.to(`room-${roomId}`).emit('player_list', playerList);
  });

  socket.on('disconnectRoom', () => {
    console.log(`User  ${socket.id} Disconnected`);
    const index = users.findIndex(user => user.id === socket.id);
    if (index !== -1) {
      users.splice(index, 1);
      // Emitir la lista de jugadores actualizada a todos los clientes en la sala
      const playerList = users.map((user, index) => ({ position: index + 1, userName: user.name }));
      io.to(`room-${roomId}`).emit('player_list', playerList);
    }
  });
});

server.listen(3001, () => {
  console.log("Server listen on port 3001");
});

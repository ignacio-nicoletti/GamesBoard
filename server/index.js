import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { barajar, shuffle } from "./functions/functions.js";
import { log } from "console";

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});

const users = [];

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", ({ roomId, userName }) => {
    console.log(`User ${userName} joined room ${roomId}`);
    socket.join(`room-${roomId}`);

    const user = { id: socket.id, name: userName };
    users.push(user);

    // Obtener la posición del usuario en la sala
    const position = users.length;
    // Enviar la posición del usuario de vuelta al cliente
    socket.emit("position", position);

    // Emitir la lista de jugadores actualizada a todos los clientes en la sala
    const playerList = users.map((user, index) => ({
      position: index + 1,
      userName: user.name,
    }));
    io.to(`room-${roomId}`).emit("player_list", playerList);


    //----------barajar------------- 
    
   

    socket.on("barajar", (ronda) => {
     
      let baraja = barajar();
      let cartasMezcladas = shuffle(baraja);
    
      // Enviar las cartas a cada jugador según la cantidad correspondiente a la ronda
      if (ronda.cardPorRonda === 1) {
        io.to(`room-${roomId}`).emit("mezcladas", {
          jugador1: [cartasMezcladas[0]],
          jugador2: [cartasMezcladas[1]],
          jugador3: [cartasMezcladas[2]],
          jugador4: [cartasMezcladas[3]],
        });
      } else if (ronda.cardPorRonda === 3) {
        io.to(`room-${roomId}`).emit("mezcladas", {
          jugador1: cartasMezcladas.slice(0, 3),
          jugador2: cartasMezcladas.slice(3, 6),
          jugador3: cartasMezcladas.slice(6, 9),
          jugador4: cartasMezcladas.slice(9, 12),
        });
      } else if (ronda.cardPorRonda === 5) {
        io.to(`room-${roomId}`).emit("mezcladas", {
          jugador1: cartasMezcladas.slice(0, 5),
          jugador2: cartasMezcladas.slice(5, 10),
          jugador3: cartasMezcladas.slice(10, 15),
          jugador4: cartasMezcladas.slice(15, 20),
        });
      } else if (ronda.cardPorRonda === 7) {
        io.to(`room-${roomId}`).emit("mezcladas", {
          jugador1: cartasMezcladas.slice(0, 7),
          jugador2: cartasMezcladas.slice(7, 14),
          jugador3: cartasMezcladas.slice(14, 21),
          jugador4: cartasMezcladas.slice(21, 28),
        });
      }
    });

   //----------barajar------------- 


    socket.on("disconnectRoom", () => {
      console.log(`User  ${socket.id} Disconnected`);
      const index = users.findIndex((user) => user.id === socket.id);
      if (index !== -1) {
        users.splice(index, 1);
        // Emitir la lista de jugadores actualizada a todos los clientes en la sala
        const playerList = users.map((user, index) => ({
          position: index + 1,
          userName: user.name,
        }));
        io.to(`room-${roomId}`).emit("player_list", playerList);
      }
    });
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} Desconectado del servidor`);
  });
});

server.listen(3001, () => {
  console.log("Server listen on port 3001");
});

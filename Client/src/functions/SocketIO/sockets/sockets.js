import { io } from "socket.io-client";

const URL = "http://localhost:3001";
// Se conecta al servidor
export const socket = io(URL,{ forceNew: true });

export const connectSocket = async () => {
  
  socket.on("connect", () => {
    console.log("Conectado al servidor");
  });

  socket.on("disconnect", () => {
    console.log("Desconectado del servidor");
  });

  return socket;
};

//se desconecta del servidor
export const disconnectRoom = () => {
  console.log("Disconnecting socket...");
  socket.emit("disconnectRoom");
};

// ingresa a una sala

export const joinGameRoom = (roomId, userName) => {
  return new Promise((res, rej) => {
    const responses = {}; // Objeto para almacenar todas las respuestas

    // Manejar el evento 'room_joined'
    socket.once("room_joined", (data) => {
      responses.roomJoined = data;
      checkIfReadyToResolve();
    });

    // Manejar el evento 'player_list'
    socket.once("player_list", (data) => {
      responses.playerList = data;
      checkIfReadyToResolve();
    });

    // Manejar el evento 'position'
    socket.on("position", (data) => {
      responses.position = data;
      checkIfReadyToResolve();
    });

    // Manejar el evento 'room_join_error'
    socket.once("room_join_error", ({ error }) => {
      rej(error);
    });

    // Función para verificar si todas las respuestas han sido recibidas y resolver la promesa
    function checkIfReadyToResolve() {
      if (Object.keys(responses).length === 3) {
        res(responses); // Resolver la promesa con todas las respuestas
      }
    }

    // Emitir el evento 'join_room'
    socket.emit("join_room", { roomId, userName });
  });
};


export const OnSalaLLena = (socket) => {
  return new Promise((res, rej) => {
    socket.on("salaLLena", (data) => {
      res(data);
    });
  });
};
;


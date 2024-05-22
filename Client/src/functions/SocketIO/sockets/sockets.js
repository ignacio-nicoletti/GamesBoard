import { io } from "socket.io-client";

const URL = "http://localhost:3001";
// Se conecta al servidor
export const socket = io(URL,{ forceNew: true });


export const connectSocket = () => {
  return new Promise((resolve) => {
    socket.on("connect", () => {
      console.log("Conectado al servidor");
      resolve(socket);
    });

    socket.on("disconnect", () => {
      console.log("Desconectado del servidor");
      disconnectRoom()
    });
  });
};

// Función para solicitar la información de todas las salas
export const getAllRoomsInfo = (game) => {
  return new Promise((resolve) => {
    socket.emit("get_all_rooms_info", { game });
    socket.on("all_rooms_info", (data) => {
      resolve(data);
    });
  });
};

//se desconecta de la sala
export const disconnectRoom = () => {
  console.log("Disconnect from room...");
  socket.emit("disconnectRoom");
};

// ingresa a una sala
export const CreateGameRoom = (game, roomId, userName) => {
  return new Promise((res, rej) => {
    const responses = {}; // Objeto para almacenar todas las respuestas

    // Manejar el evento 'room_joined'
    socket.once("room_joined", (data) => {
      // responses.roomJoined = data;
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
    socket.emit("join_room", { game, roomId, userName });
  });
};

export const joinGameRoom = (game, roomId, userName) => {
  return new Promise((resolve, reject) => {
    const responses = {};

    // Manejar el evento 'room_joined'
    socket.once('room_joined', (data) => {
      // responses.roomJoined = data;
      checkIfReadyToResolve();
    });

    // Manejar el evento 'player_list'
    socket.once('player_list', (data) => {
      responses.playerList = data;
      checkIfReadyToResolve();
    });

    // Manejar el evento 'position'
    socket.once('position', (data) => {
      responses.position = data;
      checkIfReadyToResolve();
    });

    // Manejar el evento 'room_join_error'
    socket.once('room_join_error', (error) => {
      reject(error);
    });

    // Función para verificar si todas las respuestas han sido recibidas y resolver la promesa
    function checkIfReadyToResolve() {
      if (Object.keys(responses).length === 3) {
        resolve(responses);
      }
    }

    // Emitir el evento 'join_room'
    socket.emit('join_room', { game, roomId, userName });
  });
};





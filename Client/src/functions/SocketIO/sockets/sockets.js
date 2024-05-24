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
  socket.emit("disconnectRoom");
};

// ingresa a una sala
export const CreateGameRoom = (game, roomId, userName) => {
  return new Promise((res, rej) => {
    const responses = {};

    socket.once("room_joined", (data) => {
      responses.roomJoined = data;
      checkIfReadyToResolve();
    });

    socket.once("player_list", (data) => {
      responses.playerList = data;
      checkIfReadyToResolve();
    });

    socket.once("position", (data) => {
      responses.position = data;
      checkIfReadyToResolve();
    });

    socket.once("room_join_error", ({ error }) => {
      rej(error);
    });

    function checkIfReadyToResolve() {
      if (Object.keys(responses).length === 3) {
        res(responses);
      }
    }

    socket.emit("join_room", { game, roomId, userName });
  });
};

export const joinGameRoom = (game, roomId, userName) => {
  return new Promise((resolve, reject) => {
    const responses = {};

    socket.once('room_joined', (data) => {
      responses.roomJoined = data;
      checkIfReadyToResolve();
    });

    socket.once('player_list', (data) => {
      responses.playerList = data;
      checkIfReadyToResolve();
    });

    socket.once('position', (data) => {
      responses.position = data;
      checkIfReadyToResolve();
    });

    socket.once('room_join_error', (error) => {
      reject(error);
    });

    function checkIfReadyToResolve() {
      if (Object.keys(responses).length === 3) {
        resolve(responses);
      }
    }

    socket.emit('join_room', { game, roomId, userName });
  });
};



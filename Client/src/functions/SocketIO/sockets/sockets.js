import { io } from "socket.io-client";

const URL = "http://localhost:3001";
// Se conecta al servidor
export const connectSocket = async () => {
  const socket = io(URL,{ forceNew: true });
  
  socket.on("connect", () => {
    console.log("Conectado al servidor");
  });

  socket.on("disconnect", () => {
    console.log("Desconectado del servidor");
  });

  socket.on("respuesta", (data) => {
    console.log("Mensaje recibido del servidor:", data);
  });

  return socket;
};


//se desconecta del servidor
export const disconnectSocket = () => {
  console.log("Disconnecting socket...");
  // if (socket) Socket.disconnect();
};

// ingresa a una sala

export const joinGameRoom = (socket, roomId, userName) => {
  return new Promise((res, rej) => {
    socket.emit("join_game", roomId, userName);
    socket.on("room_joined", () => res(true));
    socket.on("room_join_error", ({ error }) => rej(error));
  });
};

export const OnSalaLLena = (socket) => {
  return new Promise((res, rej) => {
    socket.on("salaLLena", (data) => {
      res(data);
    });
  });
};
export const EmitAsignar = (socket,roomId) => {
  socket.emit("asignar");
};

export const OnAsignar = (socket) => {
  return new Promise((res, rej) => {
    socket.on("asignar", (data) => {
      res(data)
    });
  });
};

import { io } from "socket.io-client";
import { GetDecodedCookie } from "../../../utils/DecodedCookie";

const URL = "http://localhost:3001";
// Se conecta al servidor

export let socket = io(URL, { autoConnect: true });

// export const socketConnect = () => {
//   const token = GetDecodedCookie("cookieToken");
//   if (token) {
//     socket.connect();
//   }
//   connectSocket();
// };

export const connectSocket = () => {
  return new Promise((resolve) => {
    socket.connect();
    socket.on("connect", () => {
      console.log("Conectado al servidor");
      resolve(socket);
    });

  });
};

export const disconnectServer=()=>{
  socket.on("disconnectServer", () => {
    console.log("Desconectado del servidor");
    disconnectRoom();
  });
  
}

export const disconnectRoom =  (game, roomId) => {
  socket.emit("disconnectRoom", { game, roomId });
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

export const CreateGameRoom = (
  game,
  roomId,
  userName,
  maxUsers = 6,
  selectedAvatar,
  infoUser
) => {
  return new Promise((res, rej) => {
    const responses = {};

    socket.once("room_created", (data) => {
      responses.roomCreated = data;
      checkIfReadyToResolve();
    });

    socket.once("player_list", (data) => {
      responses.playerList = data;
      checkIfReadyToResolve();
    });

    socket.once("room_creation_error", ({ error }) => {
      console.log(error);
      rej(error);
    });

    function checkIfReadyToResolve() {
      if (Object.keys(responses).length === 2) {
        // Asegúrate de que esto coincida con el número de eventos esperados
        res(responses);
      }
    }

    socket.emit("create_room", {
      game,
      roomId,
      userName,
      maxUsers,
      selectedAvatar,
      email: infoUser.email
    });
  });
};


export const joinGameRoom = (game, roomId, userName, selectedAvatar,infoUser) => {
  return new Promise((resolve, reject) => {
    const responses = {};

    socket.once("room_joined", (data) => {
      responses.roomJoined = data;
      checkIfReadyToResolve();
    });

    socket.once("player_list", (data) => {
      responses.playerList = data;
      checkIfReadyToResolve();
    });

    socket.once("room_join_error", ({ error }) => {
      reject(error);
    });

    function checkIfReadyToResolve() {
      if (Object.keys(responses).length === 2) {
        // Asegúrate de que esto coincida con el número de eventos esperados
        resolve(responses);
      }
    }

    socket.emit("join_room", { game, roomId, userName, selectedAvatar,email:infoUser.email });
  });
};

export const distribute = (round, setPlayers, players) => {
  socket.emit("distribute", { round, players });

  socket.on("distribute", (data) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player, index) => {
        const playerIndex = index + 1;
        return {
          ...player,
          cardPerson: data[`player${playerIndex}`] || [],
        };
      })
    );
  });
};

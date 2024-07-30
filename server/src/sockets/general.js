export function createRooms(numberOfRooms, gameName, cantUsers) {
  const rooms = {};
  for (let i = 1; i <= numberOfRooms; i++) {
    rooms[i] = {
      users: [],
      round: {},
      gameStarted: false,
      maxUsers: cantUsers,
      roomId: i,
      results: [],
      game: gameName,
    };
  }
  return rooms;
}

export const permanentRooms = {
  Berenjena: createRooms(10, "Berenjena", 6),
  Horserace: createRooms(15, "Horserace", 10),
  Poker: createRooms(10, "Poker"),
  Truco: createRooms(10, "Truco"),
};

export const handleEmptyRoom = (room, game, roomId) => {
  if (roomId <= 10) {
    // Si la sala es una de las primeras 10 creadas (permanente), se vacía y resetea
    room.gameStarted = false;
    room.users = [];
    room.round = {};
    room.results = [];
    console.log(`Sala permanente ${roomId} vaciada y reseteada.`);
  } else {
    // Si la sala no es permanente, se elimina
    delete permanentRooms[game][roomId];
    console.log(`Sala ${roomId} eliminada.`);
  }
};

export default function GeneralSocket(io) {
  io.on("connection", (socket) => {
    
    socket.on("get_all_rooms_info", ({ game }) => {
      const rooms = permanentRooms[game];
      if (rooms) {
        const allRoomsInfo = Object.keys(rooms).map((roomId) => ({
          roomId: Number(roomId),
          users: rooms[roomId].users,
          gameStarted: rooms[roomId].gameStarted,
          maxUsers: rooms[roomId].maxUsers,
        }));
        socket.emit("all_rooms_info", allRoomsInfo);
      } else {
        socket.emit("error", { error: "Invalid game" });
      }
    });

    socket.on("disconnectRoom", (data) => {
      const { game, roomId } = data;
      if (!game || !roomId) {
        console.log("Los parámetros game o roomId son indefinidos.");
        return;
      }

      if (!permanentRooms[game] || !permanentRooms[game][roomId]) {
        console.log(`Sala no encontrada: ${roomId} en el juego: ${game}`);
        return;
      }

      const room = permanentRooms[game][roomId];
      const userIndex = room.users.findIndex(
        (user) => user.idSocket === socket.id
      );

      if (userIndex === -1) {
        console.log(`Usuario no encontrado en la sala: ${roomId}`);
        return;
      }

      const disconnectedUser = room.users[userIndex];

      if ((room.gameStarted = true)) {
        disconnectedUser.connect = false;
        console.log(
          `Usuario ${socket.id} desconectado de la sala ${roomId}. Marcado como desconectado.`
        );

        if (room.users.every((user) => !user.connect)) {
          handleEmptyRoom(room, game, roomId);
        }
      } else {
        // Si el juego no ha comenzado, el usuario se elimina de la sala
        room.users.splice(userIndex, 1);
        room.users.forEach((user, index) => {
          user.position = index + 1;
        });
      }
      if (game === "Berenjena") {
        io.to(`${game}-${roomId}`).emit("roomRefresh", {
          users: room.users,
          round: room.round,
          room: room,
        });
      } else if (game === "Horserace") {
        io.to(`${game}-${roomId}`).emit("roomRefresh_horserace", {
          users: room.users,
          round: room.round,
          room: room,
        });
      }
    });
  });
}

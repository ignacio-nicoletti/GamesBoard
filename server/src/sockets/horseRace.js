import { permanentRooms } from "./general.js";
export default function HorseRaceSockets(io) {
  io.on("connection", (socket) => {
    socket.on("get_all_rooms_info", ({ game }) => {
      const rooms = permanentRooms[game];
      if (rooms) {
        const allRoomsInfo = Object.keys(rooms).map((roomId) => ({
          roomId: Number(roomId),
          users: rooms[roomId].users,
          gameStarted: rooms[roomId].gameStarted,
          maxUsers: rooms[roomId].maxUsers || 6,
        }));
        socket.emit("all_rooms_info", allRoomsInfo);
      } else {
        socket.emit("error", { error: "Invalid game" });
      }
    });
    
  });
}

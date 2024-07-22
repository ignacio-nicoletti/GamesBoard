import { Player } from "../models/players.js";
import { permanentRooms } from "./general.js";
export default function HorseRaceSockets(io) {
  io.on("connection", (socket) => {
    socket.on(
      "create_room",
      async ({
        game,
        roomId,
        userName,
        maxUsers = 10,
        selectedAvatar,
        email,
      }) => {
        const rooms = permanentRooms[game];
        if (!rooms) {
          socket.emit("room_creation_error", { error: "Invalid game" });
          return;
        }

        if (rooms[roomId]) {
          socket.emit("room_creation_error", { error: "Room already exists" });
          return;
        }

        rooms[roomId] = {
          gameStarted: false,
          maxUsers,
          roomId: roomId,
          game: game,
          users: [],
          round: {},
          results: [],
        };

        let idDB = "-";
        if (email !== "invitado") {
          let player = await Player.findOne({ email: email });
          idDB = player._id;
        }

        const user = {
          idSocket: socket.id,
          idDB,
          userName,
          roomId,
          email: email,
          position: 1,
          ready: false,
          connect: true,
          avatar: selectedAvatar,
          id: 1, // position
          betP: "", // suit apostado
          myturnA: false, // boolean // turno apuesta
          myturnR: false, // boolean // turno ronda
          cumplio: false, // boolean // cumplio su apuesta
          points: 0, // puntos
        };

        const round = {
          users: null, //usuarios conectados
          numRounds: 0, //num de ronda
          hands: 0, //igual a cant de cards repartidas
          cardXRound: 1, //cant de cartas que se reparten
          typeRound: "waiting", //apuesta o ronda
          turnJugadorA: 1, //1j 2j 3j 4j apuesta
          turnJugadorR: 1, //1j 2j 3j 4j ronda
          obligado: null, //numero de jugador obligado
          betTotal: 0, //suma de la apuesta de todos
          cardWinxRound: {}, //card ganada en la ronda    {value: null, suit: '', id: ''}
          lastCardBet: {}, //ultima card apostada
          beforeLastCardBet: {}, //anteultima card apostada
          ganadorRonda: null,
          cantQueApostaron: 0,
          cantQueTiraron: 0,
          roomId: { gameId: game, roomId: roomId }, // Guarda la data correctamente
        };

        rooms[roomId].users.push(user);
        rooms[roomId].round = round;

        console.log(
          `Room ${roomId} created by ${userName} in game ${game} with max ${maxUsers} users`
        );
        socket.join(`${game}-${roomId}`);
        socket.emit("room_created", {
          myInfo: {
            idSocket: user.idSocket,
            userName: user.userName,
            email: user.email,
            position: user.position,
          },
          room: rooms[roomId],
        });

        io.to(`${game}-${roomId}`).emit("player_list", {
          users: rooms[roomId].users,
          round: rooms[roomId].round,
        });
      }
    );
  });
}

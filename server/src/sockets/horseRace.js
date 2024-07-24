import { Player } from "../models/players.js";
import { permanentRooms } from "./general.js";
export default function HorseRaceSockets(io) {
  io.on("connection", (socket) => {
    
    socket.on(
      "create_room_horserace",
      async ({
        game,
        roomId,
        userName,
        maxUsers = 10,
        selectedAvatar,
        email,
      }) => {
        const rooms = permanentRooms[game];
        console.log("entre");
        if (!rooms) {
          socket.emit("room_creation_error_horserace", { error: "Invalid game" });
          return;
        }

        if (rooms[roomId]) {
          socket.emit("room_creation_error_horserace", { error: "Room already exists" });
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
        socket.emit("room_created_horserace", {
          myInfo: {
            idSocket: user.idSocket,
            userName: user.userName,
            email: user.email,
            position: user.position,
          },
          room: rooms[roomId],
        });

        io.to(`${game}-${roomId}`).emit("player_list_horserace", {
          users: rooms[roomId].users,
          round: rooms[roomId].round,
        });
      }
    );

    socket.on(
      "join_room",
      async ({ game, roomId, userName, selectedAvatar, email }) => {
        const rooms = permanentRooms[game];
        if (!rooms) {
          socket.emit("error", { error: "Invalid game" });
          return;
        }

        if (!rooms[roomId]) {
          socket.emit("room_join_error_horserace", { error: "Room does not exist" });
          return;
        }

        const room = rooms[roomId];

        const userInRoom = room.users.find(
          (user) => user.userName === userName || user.email === email
        );

        if (userInRoom) {
          if (!userInRoom.connect && room.gameStarted) {
            // Permitir reconexión si el juego ya ha comenzado y el usuario está en room.users
            userInRoom.idSocket = socket.id;
            userInRoom.connect = true;

            socket.join(`${game}-${roomId}`);
            socket.emit("room_joined_horserace", {
              roomId,
              myInfo: {
                idSocket: userInRoom.idSocket,
                userName: userInRoom.userName,
                email: userInRoom.email,
                position: userInRoom.position,
              },
            });
        
            console.log(
              `User ${userName} rejoined room ${roomId} in game ${game}`
            );
            // io.to(`${game}-${roomId}`).emit("roomRefresh", {
            //   users: room.users,
            //   round: room.round,
            //   room: room,
            //   results: room.results,
            // });
          } else {
            // Usuario ya está en la sala y no puede volver a unirse mientras el juego esté en curso
            socket.emit("room_join_error_horserace", {
              error:
                "UserName is already in the room or game has already started",
            });
          }
          return;
        }

        if (room.users.find((user) => user.userName === userName)) {
          // Verificar si el userName ya está en la sala
          socket.emit("room_join_error", {
            error: "UserName already exists in the room",
          });
          return;
        }

        const maxUsers = room.maxUsers || 6;

        if (room.users.length >= maxUsers) {
          socket.emit("room_join_error_horserace", { error: "Room is full" });
          return;
        }

        if (room.gameStarted) {
          socket.emit("room_join_error_horserace", {
            error: "Game already started, cannot join",
          });
          return;
        }

        let idDB = "-";
        if (email !== undefined) {
          let player = await Player.findOne({ email: email });
          if (player) {
            idDB = player.id;
          }
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
          points: 0, // puntos
        };


        room.users.push(user);

        console.log(`User ${userName} joined room ${roomId} in game ${game}`);
        socket.join(`${game}-${roomId}`);

        socket.emit("room_joined_horserace", {
          roomId,
          myInfo: {
            idSocket: user.idSocket,
            userName: user.userName,
            email: user.email,
            position: user.position,
          },
        });

        io.to(`${game}-${roomId}`).emit("player_list_horserace", {
          users: room.users,
          round: room.round,
        });
      }
    );


    socket.on("roomRefresh_horserace", (dataRoom) => {
      if (!dataRoom || !dataRoom.game || !dataRoom.roomId) {
        return;
      }

      const room = permanentRooms[dataRoom.game]
        ? permanentRooms[dataRoom.game][dataRoom.roomId]
        : undefined;

      if (!room) {
        return;
      }

      io.to(`${dataRoom.game}-${dataRoom.roomId}`).emit("roomRefresh_horserace", {
        users: room.users,
        round: room.round,
        room: room,
        results: room.results,
      });
    });

    socket.on("player_ready_horserace", (dataRoom) => {
      const game = dataRoom.game;
      const roomId = dataRoom.roomId;
      const room = permanentRooms[game] && permanentRooms[game][roomId];
      if (!room) return;

      const user = room.users.find((u) => u.idSocket === socket.id);
      if (user) {
        user.ready = true;
        io.to(`${game}-${roomId}`).emit("player_ready_status_horserace", {
          idSocket: socket.id,
          ready: true,
        });

        const allReady = room.users.every((u) => u.ready);
        if (allReady && room.users.length > 1) {
          room.gameStarted = true;
          const userObligado = Math.floor(Math.random() * room.users.length);
          const nextTurn = (userObligado + 1) % room.users.length;

          // Actualizar el objeto round
          room.round.obligado = userObligado + 1;
          room.round.turnJugadorA = nextTurn + 1;
          room.round.numRounds = (room.round.numRounds || 0) + 1; // Incrementar la ronda
          room.round.users = room.users.length;

          // Inicializar la ronda actual en results
          const currentRound = {
            round: {
              numRounds: room.round.numRounds,
              cardXRound: room.round.cardXRound,
              obligado: room.round.obligado,
              cardWinxRound: room.round.cardWinxRound,
              ganadorRonda: room.round.ganadorRonda,
            },
            players: room.users.map((user) => ({
              userName: user.userName,
              email: user.email,
              betP: user.betP,
              cardsWins: user.cardsWins,
              cumplio: user.cumplio,
              points: user.points,
            })),
          };

          room.results.push(currentRound);

          // Emitir el evento de inicio del juego a todos los usuarios en la sala
          io.to(`${game}-${roomId}`).emit("start_game_horserace", {
            round: room.round,
            users: room.users,
            results: room.results,
            room: room,
          });
        }
      }
    });
  });
}

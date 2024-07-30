import { distribute, shuffle } from "../../functions/functions.js";
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

        if (!rooms) {
          socket.emit("room_creation_error_horserace", {
            error: "Invalid game",
          });
          return;
        }

        if (rooms[roomId]) {
          socket.emit("room_creation_error_horserace", {
            error: "Room already exists",
          });
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
          hasBet: false, // flag to check if the player has bet
          points: 0, // puntos
        };

        const round = {
          users: null, //usuarios conectados
          numRounds: 0, //num de ronda
          typeRound: "Bet", //apuesta o ronda
          turnJugadorA: 1, //1j 2j 3j 4j apuesta
          ganadorRonda: null,
          cantQueApostaron: 0,
          sideLeftCards: [],
          cardsDeck: [],
          cardSuit: {suit:"",value:null},
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
      "join_room_horserace",
      async ({ game, roomId, userName, selectedAvatar, email }) => {
        const rooms = permanentRooms[game];
        if (!rooms) {
          socket.emit("error", { error: "Invalid game" });
          return;
        }

        if (!rooms[roomId]) {
          socket.emit("room_join_error_horserace", {
            error: "Room does not exist",
          });
          return;
        }

        const room = rooms[roomId];

        const userInRoom = room.users.find(
          (user) => user.userName === userName || user.email === email
        );

        if (userInRoom) {
          if (!userInRoom.connect && room.gameStarted) {
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
          } else {
            socket.emit("room_join_error_horserace", {
              error:
                "UserName is already in the room or game has already started",
            });
          }
          return;
        }

        if (room.users.find((user) => user.userName === userName)) {
          socket.emit("room_join_error", {
            error: "UserName already exists in the room",
          });
          return;
        }

        const maxUsers = room.maxUsers || 10;

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
          position: room.users.length + 1,
          ready: false,
          connect: true,
          avatar: selectedAvatar,
          id: 1, // position
          betP: "", // suit apostado
          hasBet: false, // flag to check if the player has bet
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

      io.to(`${dataRoom.game}-${dataRoom.roomId}`).emit(
        "roomRefresh_horserace",
        {
          users: room.users,
          round: room.round,
          room: room,
          results: room.results,
        }
      );
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

          room.round.numRounds = (room.round.numRounds || 0) + 1;
          room.round.users = room.users.length;

          io.to(`${game}-${roomId}`).emit("start_game_horserace", {
            round: room.round,
            users: room.users,
            results: room.results,
            room: room,
          });
        }
      }
    });

    socket.on("BetPlayer_horserace", ({ bet, myPosition, dataRoom }) => {
      if (!dataRoom) return;
      const { game, roomId, round } = dataRoom;
      if (!round || !roomId || !game) {
        console.error("Invalid round or roomId object:", dataRoom);
        socket.emit("error", { error: "Invalid round or roomId object" });
        return;
      }

      const room =
        permanentRooms[dataRoom.game] &&
        permanentRooms[dataRoom.game][dataRoom.roomId];

      if (!room) return;

      const userIndex = room.users.findIndex(
        (user) => user.position === myPosition
      );

      if (userIndex !== -1) {
        room.users[userIndex].betP = bet;
        room.users[userIndex].hasBet = true; // Mark the user as having bet
      }

      room.round.cantQueApostaron += 1;

      if (room.round.cantQueApostaron === room.users.length) {
        room.round.typeRound = "ronda";
      }

      io.to(`${dataRoom.game}-${roomId}`).emit("update_game_state_horserace", {
        round: room.round,
        players: room.users,
        results: room.results,
      });

      socket.emit("bet_received", { bet: true });
    });

    socket.on("distributeHorserace", (dataRoom) => {
      if (!dataRoom) return;
      const { game, roomId, round } = dataRoom;
    
      if (!round || !roomId || !game) {
        console.error("Invalid round or roomId object:", dataRoom);
        socket.emit("error", { error: "Invalid round or roomId object" });
        return;
      }
    
      try {
        let deck = distribute();
        let shuffledCards = shuffle(deck);
        shuffledCards = shuffledCards.filter((card) => card.value !== "11");
    
        const room = permanentRooms[game] && permanentRooms[game][roomId];
        if (!room) return;
    
        // Asignar la primera carta a cardSuit
        const initialCardSuit = shuffledCards.shift();
    
        room.round.cardSuit = initialCardSuit;
        room.round.sideLeftCards = shuffledCards.slice(0, 5);
        room.round.cardsDeck = shuffledCards.slice(5);
    
        io.to(`${game}-${roomId}`).emit("distributeHorserace", {
          round: room.round,
        });
      } catch (error) {
        console.error("Error in distribute function:", error);
        socket.emit("error", { error: "Error in distribute function" });
      }
    });
    
    socket.on("tirarCarta_horserace", (dataRoom) => {
      if (!dataRoom) return;
      const { game, roomId, round } = dataRoom;
    
      if (!round || !roomId || !game) {
        console.error("Invalid round or roomId object:", dataRoom);
        socket.emit("error", { error: "Invalid round or roomId object" });
        return;
      }
    
      try {
        const room = permanentRooms[game] && permanentRooms[game][roomId];
        if (!room) return;
    
        if (!room.round || !room.round.cardsDeck || room.round.cardsDeck.length === 0) {
          console.error("No cards available in the deck");
          socket.emit("error", { error: "No cards available in the deck" });
          return;
        }
    
        const drawnCard = room.round.cardsDeck.shift();
        room.round.cardSuit = drawnCard;
    
        // io.to(`${game}-${roomId}`).emit("tirarCarta_horserace", {
        //   round: room.round,
        // });
        io.to(`${dataRoom.game}-${dataRoom.roomId}`).emit(
          "roomRefresh_horserace",
          {
            users: room.users,
            round: room.round,
            room: room,
            results: room.results,
          }
        );
      } catch (error) {
        console.error("Error in tirarCarta function:", error);
        socket.emit("error", { error: "Error in tirarCarta function" });
      }
    });
  });
}

import { distributeHorse, shuffle } from "../../functions/functions.js";
import { Player } from "../models/players.js";
import { handleEmptyRoom, permanentRooms } from "./general.js";

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
          avatar: selectedAvatar,
          betP: "", // suit apostado
          hasBet: false, // flag to check if the player has bet
          inBet: false,
          points: 0, // puntos
        };

        const round = {
          users: [], //usuarios conectados
          typeRound: "Bet", //apuesta o ronda
          cantQueApostaron: 0,
          sideLeftCards: [
            { back: true },
            { back: true },
            { back: true },
            { back: true },
            { back: true },
          ],
          cardsDeck: [], //mazo
          cardSuit: { suit: "", value: null, back: false }, //carta tirada
          horseDeck: [
            { suit: "oro", value: 11, back: false, pos: 6 },
            { suit: "espada", value: 11, back: false, pos: 6 },
            { suit: "copa", value: 11, back: false, pos: 6 },
            { suit: "basto", value: 11, back: false, pos: 6 },
          ], //los 4 caballos
          roomId: { gameId: game, roomId: roomId }, // Guarda la data correctamente
        };

        rooms[roomId].users.push(user);
        rooms[roomId].round = round;

        console.log(
          `Room ${roomId} created by ${userName} in game ${game} with max ${maxUsers} users`
        );
        socket.join(`${game}-${roomId}`);
        socket.emit("room_created_horserace", {
          room: rooms[roomId],
        });

        socket.emit("room_created_myInfo_horserace", {
          //info propia
          user,
        });

        if (rooms[roomId].users.length >= 0) {
          // si ya hay gente comienza el juego
          rooms[roomId].gameStarted = true;
        }

        io.to(`${game}-${roomId}`).emit("player_list_horserace", {
          users: rooms[roomId].users,
          round: rooms[roomId].round,
          room: rooms[roomId],
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
          avatar: selectedAvatar,
          betP: "", // suit apostado
          hasBet: false, // flag to check if the player has bet
          inBet: false,
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

        socket.emit("room_joined_myInfo_horserace", {
          user,
        });

        if (room.users.length >= 0) {
          // si ya hay gente comienza el juego
          room.gameStarted = true;
        }
        io.to(`${game}-${roomId}`).emit("player_list_horserace", {
          users: rooms[roomId].users,
          round: rooms[roomId].round,
          room: rooms[roomId],
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
        }
      );
    });

    socket.on("BetPlayer_horserace", ({ inBet,bet, myPlayer, dataRoom }) => {
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
        (user) => user.userName === myPlayer.userName
      );

      if (userIndex !== -1) {
        room.users[userIndex].inBet = inBet;//true or false
        room.users[userIndex].betP = bet;
        room.users[userIndex].hasBet = true; // Mark the user as having bet
      }

      room.round.cantQueApostaron += 1;

      if (room.round.cantQueApostaron === room.users.length) {
        room.round.typeRound = "waiting";
      }

      io.to(`${dataRoom.game}-${roomId}`).emit("update_game_state_horserace", {
        round: room.round,
        players: room.users,
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
        let deck = distributeHorse(); //crea la baraja
        let shuffledCards = shuffle(deck); //mezcla

        const filteredDeck = shuffledCards.filter((card) => card.value !== 11); //borra los 11 de la baraja

        const room = permanentRooms[game] && permanentRooms[game][roomId];
        if (!room) return;
        room.round.sideLeftCards = filteredDeck.slice(0, 5); //[5]
        room.round.sideLeftCards.map((el) => (el.back = true));
        room.round.cardsDeck = filteredDeck.slice(5); //[41]
        room.round.typeRound = "ronda";
        // Asignar las cartas con valor 11 a horseDeck

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
      const { game, roomId } = dataRoom;

      if (!roomId || !game) {
        console.error("Invalid round or roomId object:", dataRoom);
        socket.emit("error", { error: "Invalid round or roomId object" });
        return;
      }

      try {
        const room = permanentRooms[game] && permanentRooms[game][roomId];
        if (!room) return;

        if (
          !room.round ||
          !room.round.cardsDeck ||
          room.round.cardsDeck.length === 0
        ) {
          console.error("No cards available in the deck");
          socket.emit("error", { error: "No cards available in the deck" });
          return;
        }

        // Asignar la primera carta a cardSuit y eliminarla de cardsDeck

        if (
          room.round.horseDeck.every((el) => el.pos < 6) &&
          room.round.sideLeftCards[4].back === true
        ) {
          room.round.sideLeftCards[4].back = false;
          let cardDown = room.round.horseDeck.find(
            (el) => el.suit === room.round.sideLeftCards[4].suit
          );
          cardDown.pos = cardDown.pos + 1;
        }
        if (
          room.round.horseDeck.every((el) => el.pos < 5) &&
          room.round.sideLeftCards[3].back === true
        ) {
          room.round.sideLeftCards[3].back = false;
          let cardDown = room.round.horseDeck.find(
            (el) => el.suit === room.round.sideLeftCards[3].suit
          );
          cardDown.pos = cardDown.pos + 1;
        }
        if (
          room.round.horseDeck.every((el) => el.pos < 4) &&
          room.round.sideLeftCards[2].back === true
        ) {
          room.round.sideLeftCards[2].back = false;
          let cardDown = room.round.horseDeck.find(
            (el) => el.suit === room.round.sideLeftCards[2].suit
          );
          cardDown.pos = cardDown.pos + 1;
        }
        if (
          room.round.horseDeck.every((el) => el.pos < 3) &&
          room.round.sideLeftCards[1].back === true
        ) {
          room.round.sideLeftCards[1].back = false;
          let cardDown = room.round.horseDeck.find(
            (el) => el.suit === room.round.sideLeftCards[1].suit
          );
          cardDown.pos = cardDown.pos + 1;
        }
        if (
          room.round.horseDeck.every((el) => el.pos < 2) &&
          room.round.sideLeftCards[0].back === true
        ) {
          room.round.sideLeftCards[0].back = false;
          let cardDown = room.round.horseDeck.find(
            (el) => el.suit === room.round.sideLeftCards[0].suit
          );
          cardDown.pos = cardDown.pos + 1;
        }

        const drawnCard = room.round.cardsDeck.shift();
        room.round.cardSuit = drawnCard;
        room.round.typeRound = "ronda";
        // Buscar en horseDeck la carta con el mismo suit y reducir su pos en 1
        const suitToMatch = drawnCard.suit;
        const horseCard = room.round.horseDeck.find(
          (card) => card.suit === suitToMatch
        );
        if (horseCard) {
          horseCard.pos = Math.max(horseCard.pos - 1, 0); // Asegurarse de que pos no sea menor a 0
        }

        const winningHorse = room.round.horseDeck.find((el) => el.pos === 0);
        if (winningHorse) {
          room.round.typeRound = "FinishGame";

          const winners = room.users.filter((user) => {
            return user.betP == winningHorse.suit;
          });

          console.log("Winners:", winners, "card:", winningHorse.suit);
          io.to(`${game}-${roomId}`).emit("Finish_game_horserace", {
            round: room.round,
          });
          return;
        }

        io.to(`${game}-${roomId}`).emit("cardTirada_horserace", {
          round: room.round,
        });
      } catch (error) {
        console.error("Error in tirarCarta function:", error);
        socket.emit("error", { error: "Error in tirarCarta function" });
      }
    });

    socket.on("reset_horserace", (dataRoom) => {
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

        // Reiniciar el estado de la ronda

        let deck = distributeHorse(); //crea la baraja
        let shuffledCards = shuffle(deck); //mezcla

        const horseDeck = shuffledCards.filter((card) => card.value === 11); // me da los 11
        const filteredDeck = shuffledCards.filter((card) => card.value !== 11); //borra los 11 de la baraja

        const round = {
          users: room.users, // mantener los usuarios conectados
          numRounds: 0, // reiniciar el número de rondas
          typeRound: "Bet", // reiniciar al tipo de ronda de apuesta
          turnJugadorA: 1, // reiniciar al turno del primer jugador para apostar
          ganadorRonda: null,
          cantQueApostaron: 0,
          sideLeftCards: [
            { back: true },
            { back: true },
            { back: true },
            { back: true },
            { back: true },
          ], //[5]
          cardsDeck: filteredDeck.slice(5), // generar un nuevo mazo de cartas
          cardSuit: { suit: "", value: null, back: false },
          horseDeck: horseDeck, // generar un nuevo mazo de caballos
          roomId: { gameId: game, roomId: roomId }, // guardar la información de la sala
        };

        room.round = round;

        io.to(`${game}-${roomId}`).emit("reset_completed_horserace", {
          round: room.round,
        });

        console.log(`Room ${roomId} reset in game ${game}`);
      } catch (error) {
        console.error("Error in reset function:", error);
        socket.emit("reset_error_horserace", {
          error: "Error in reset function",
        });
      }
    });

    socket.on("disconnect", () => {
      console.log(`Usuario desconectado: ${socket.id}`);

      // Recorrer todas las salas permanentes para buscar y manejar la desconexión del usuario
      Object.keys(permanentRooms).forEach((game) => {
        const rooms = permanentRooms[game];
        Object.keys(rooms).forEach((roomId) => {
          const room = rooms[roomId];
          const userIndex = room.users.findIndex(
            (user) => user.idSocket === socket.id
          );
          if (userIndex !== -1) {
            // Usuario encontrado en la sala, realizar acciones necesarias
            const disconnectedUser = room.users[userIndex];

            if (room.gameStarted) {
              disconnectedUser.connect = false;
              console.log(
                `Usuario ${socket.id} marcado como desconectado en la sala ${roomId}.`
              );

              // Si todos los usuarios están desconectados, manejar la sala vacía
              if (room.users.every((user) => !user.connect)) {
                handleEmptyRoom(room, game, roomId);
              }
            } else {
              // Si el juego no ha comenzado, simplemente remover al usuario de la lista de usuarios
              room.users.splice(userIndex, 1);
              room.users.forEach((user, index) => {
                user.position = index + 1;
              });
            }

            // Emitir actualización a los clientes en la sala
            io.to(`${game}-${roomId}`).emit("roomRefresh", {
              users: room.users,
              round: room.round,
              room: room,
            });
          }
        });
      });
    });
  });
}

// que no se repita dos veces la llamada
// que si resto entonces no sume
// si una carta llego a pos 0 entonces suma exp quien haya llegado y apostado gana exp y monedas
//

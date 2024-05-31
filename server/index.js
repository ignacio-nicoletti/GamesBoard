import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { distribute, shuffle } from "./functions/functions.js"; // Asegúrate de que estas funciones estén definidas en el archivo adecuado

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});

const games = {
  Berenjena: createRooms(10),
  Poker: createRooms(10),
  Truco: createRooms(10),
  Generala: createRooms(10),
};

const permanentRooms = {
  Berenjena: createRooms(10),
  Poker: createRooms(10),
  Truco: createRooms(10),
  Generala: createRooms(10),
};

function createRooms(numberOfRooms) {
  const rooms = {};
  for (let i = 1; i <= numberOfRooms; i++) {
    rooms[i] = { users: [], gameStarted: false };
  }
  return rooms;
}

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id} to server`);

  socket.on("get_all_rooms_info", ({ game }) => {
    const rooms = games[game];
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

  socket.on("join_room", ({ game, roomId, userName, selectedAvatar }) => {
    const rooms = games[game];
    if (!rooms) {
      socket.emit("error", { error: "Invalid game" });
      return;
    }

    if (!rooms[roomId]) {
      socket.emit("room_join_error", { error: "Room does not exist" });
      return;
    }

    const room = rooms[roomId];
    const maxUsers = room.maxUsers || 6;

    if (room.users.length >= maxUsers) {
      socket.emit("room_join_error", { error: "Room is full" });
      return;
    }

    if (room.gameStarted) {
      socket.emit("room_join_error", {
        error: "Game already started, cannot join",
      });
      return;
    }

    if (room.users.some((user) => user.idSocket === socket.id)) {
      socket.emit("room_join_error", { error: "User already in the room" });
      return;
    }

    const user = {
      idSocket: socket.id,
      userName,
      roomId,
      position: room.users.length + 1,
      ready: false,
      avatar: selectedAvatar,
      id: room.users.length + 1, // position
      cardPerson: [], // cards
      betP: 0, // num de cards apostadas
      cardsWins: 0, // cards ganadas
      cardBet: {}, // card apostada
      myturnA: false, // boolean // turno apuesta
      myturnR: false, // boolean // turno ronda
      cumplio: false, // boolean // cumplio su apuesta
      points: 0, // puntos
    };
    room.users.push(user);

    console.log(`User ${userName} joined room ${roomId} in game ${game}`);
    socket.join(`${game}-${roomId}`);
    socket.emit("room_joined", { roomId, position: user.position, userName });
    io.to(`${game}-${roomId}`).emit("player_list", room.users);
  });

  socket.on(
    "create_room",
    ({ game, roomId, userName, maxUsers = 6, selectedAvatar }) => {
      const rooms = games[game];
      if (!rooms) {
        socket.emit("error", { error: "Invalid game" });
        return;
      }

      if (rooms[roomId]) {
        socket.emit("room_creation_error", { error: "Room already exists" });
        return;
      }

      rooms[roomId] = { users: [], gameStarted: false, maxUsers };

      const user = {
        idSocket: socket.id,
        userName,
        roomId,
        position: rooms[roomId].users.length + 1,
        ready: false,
        avatar: selectedAvatar,
        id: rooms[roomId].users.length + 1, // position
        cardPerson: [], // cards
        betP: 0, // num de cards apostadas
        cardsWins: 0, // cards ganadas
        cardBet: {}, // card apostada
        myturnA: false, // boolean // turno apuesta
        myturnR: false, // boolean // turno ronda
        cumplio: false, // boolean // cumplio su apuesta
        points: 0, // puntos
      };
      rooms[roomId].users.push(user);

      console.log(
        `Room ${roomId} created by ${userName} in game ${game} with max ${maxUsers} users`
      );
      socket.join(`${game}-${roomId}`);
      socket.emit("room_created", {
        roomId,
        position: user.position,
        userName,
        maxUsers,
      });

      io.to(`${game}-${roomId}`).emit("player_list", rooms[roomId].users);
    }
  );

  socket.on("disconnect", () => {
    Object.keys(games).forEach((game) => {
      Object.values(games[game]).forEach((room) => {
        const index = room.users.findIndex(
          (user) => user.idSocket === socket.id
        );
        if (index !== -1) {
          room.users.splice(index, 1);
          io.to(`${game}-${room.roomId}`).emit("player_list", room.users);
        }
      });
    });

    for (const game in games) {
      const rooms = games[game];
      for (const roomId in rooms) {
        const userIndex = rooms[roomId].users.findIndex(
          (user) => user.idSocket === socket.id
        );
        if (userIndex !== -1) {
          rooms[roomId].users.splice(userIndex, 1);
          io.to(`${game}-${roomId}`).emit("player_list", rooms[roomId].users);
          if (
            rooms[roomId].users.length === 0 &&
            !permanentRooms[game][roomId]
          ) {
            delete rooms[roomId];
            console.log(`User ${socket.id} Disconnected from room =>${roomId}`);
          }
          break;
        }
      }
    }
  });

  socket.on("disconnectRoom", () => {
    let roomDisconnected = false;
    for (const game in games) {
      const rooms = games[game];
      for (const roomId in rooms) {
        const userIndex = rooms[roomId].users.findIndex(
          (user) => user.idSocket === socket.id
        );
        if (userIndex !== -1) {
          rooms[roomId].users.splice(userIndex, 1);
          io.to(`${game}-${roomId}`).emit("player_list", rooms[roomId].users);
          if (
            rooms[roomId].users.length === 0 &&
            !permanentRooms[game][roomId]
          ) {
            delete rooms[roomId];
            roomDisconnected = true;
            console.log(`User ${socket.id} Disconnected from room =>${roomId}`);
          }
          break;
        }
      }
      if (roomDisconnected) break; // Salir del bucle exterior si se desconectó de una sala
    }
  });

  socket.on("player_ready", ({ game, roomId }) => {
    // Verificar que el juego y la sala existen
    const room = games[game] && games[game][roomId];
    if (!room) return;

    // Buscar el usuario en la sala
    const user = room.users.find((u) => u.idSocket === socket.id);
    if (user) {
      // Marcar al usuario como listo
      user.ready = true;

      // Emitir el estado de los jugadores listos a todos los usuarios en la sala
      io.to(`${game}-${roomId}`).emit("player_ready_status", {
        id: user.id,
        ready: true,
      });

      // Verificar si todos los jugadores están listos y si hay al menos dos jugadores en la sala
      const allReady = room.users.every((u) => u.ready);
      if (allReady && room.users.length >= 2) {
        // Marcar que el juego ha comenzado
        room.gameStarted = true;
        const userObligado = Math.floor(Math.random() * room.users.length);
        const nextTurn = (userObligado + 1) % room.users.length;
        // Emitir el evento de inicio del juego a todos los usuarios en la sala
        io.to(`${game}-${roomId}`).emit("start_game", {
          userObligado,
          nextTurn,
          room,
          cantUser: room.users.length,
          roomId: roomId,
          game,
        });
      }
    }
  });

  socket.on("distribute", ({ round, players }) => {
    if (!round || !round.roomId || !round.roomId.game || !round.roomId.roomId) {
      console.error("Invalid round or roomId object:", round);
      socket.emit("error", { error: "Invalid round or roomId object" });
      return;
    }

    const game = round.roomId.game;
    const roomId = round.roomId.roomId;

    try {
      let deck = distribute(); // Function to get the deck
      let cartasMezcladas = shuffle(deck); // Function to shuffle the deck

      const numPlayers = players.length;
      const cardsPerPlayer = round.cardXRound;

      const totalCardsToDistribute = numPlayers * cardsPerPlayer;

      if (cartasMezcladas.length < totalCardsToDistribute) {
        console.error("Not enough cards to distribute.");
        socket.emit("error", { error: "Not enough cards to distribute" });
        return;
      }

      let distributedCards = {};

      for (let i = 0; i < numPlayers; i++) {
        distributedCards[`jugador${i + 1}`] = [];

        for (let j = 0; j < cardsPerPlayer; j++) {
          const card = cartasMezcladas.pop();
          distributedCards[`jugador${i + 1}`].push(card);
        }
      }
      io.to(`${round.roomId.game}-${roomId}`).emit(
        "distribute",
        distributedCards
      );
    } catch (error) {
      console.error("Error in distribute function:", error);
      socket.emit("error", { error: "Error in distribute function" });
    }
  });

  socket.on("BetPlayer", ({ round, players, bet, myPosition }) => {
    // Correctly accessing the room ID
    const roomId = round.roomId.roomId;
    const room = games[round.roomId.game] && games[round.roomId.game][roomId];
    if (!room) return;

    // Actualizar la apuesta del jugador
    const playerIndex = players.findIndex(
      (player) => player.position === myPosition
    );
    if (playerIndex !== -1) {
      players[playerIndex].betP = bet;
    }

    // Determinar el siguiente jugador en turno
    let nextTurn = (round.turnJugadorA % players.length) + 1;

    round.cantQueApostaron = round.cantQueApostaron + 1;
    round.betTotal = Number(round.betTotal) + Number(bet);

    if (round.cantQueApostaron === players.length) {
      // Cambiar de ronda
      round.typeRound = "ronda";
      round.turnJugadorR = (round.obligado % players.length) + 1;
      round.cantQueApostaron = 0;
    } else {
      // Continuar con la ronda de apuestas
      round.turnJugadorA = nextTurn;
    }

    io.to(`${round.roomId.game}-${roomId}`).emit("update_game_state", {
      round,
      players,
    });
  });

  socket.on("tirar_carta", ({ round, players, myPosition, value, suit }) => {
    //-----------------Errores---------------------------
    if (!round || !round.roomId || !round.roomId.game || !round.roomId.roomId) {
      console.error("Invalid round or roomId object:", round);
      socket.emit("error", { error: "Invalid round or roomId object" });
      return;
    }

    const game = round.roomId.game;
    const roomId = round.roomId.roomId;
    const room = games[game] && games[game][roomId];
    if (!room) {
      console.error("Room not found:", roomId);
      return;
    }

    const playerIndex = room.users.findIndex(
      (user) => user.position === myPosition
    );
    if (playerIndex === -1) {
      console.error("Player not found in the room:", myPosition);
      return;
    }
    //-----------------Errores-----------------

    if (round.typeRound === "ronda" && myPosition === round.turnJugadorR) {
      //-----------------Saber qué carta es mayor-----------------
      const card = { value, suit, id: playerIndex + 1 };
      room.users[playerIndex].cardBet = card;
      
      if (round.cantQueTiraron === 0) {
        round.lastCardBet = card;
        round.cardWinxRound = card;
      } else {
        round.beforeLastCardBet = round.lastCardBet;
        round.lastCardBet = card;
      
        // Comparar solo los valores de las cartas
        round.cardWinxRound =
          round.lastCardBet.value >= round.beforeLastCardBet.value
            ? round.lastCardBet
            : round.beforeLastCardBet;
      }
      //-----------------Saber qué carta es mayor-----------------

      //-----------------Actualizar jugador-----------------
      let updatedPlayers = players.map((player) => {
        if (player.position === myPosition) {
          return {
            ...player,
            cardPerson: player.cardPerson.filter(
              (c) => !(c.value === value && c.suit === suit)
            ),
            cardBet: card, // Asignar la carta a cardBet
          };
        }
        return player;
      });
      //-----------------Actualizar jugador-----------------

      //-----------------Manejo de turnos y Reset-----------------
      round.cantQueTiraron += 1;
      round.turnJugadorR = (round.turnJugadorR % players.length) + 1;
      //-----------------cambio de mano-----------------
      if (round.cantQueTiraron === players.length) {
        round.cantQueTiraron = 0;
        round.hands += 1;
        round.turnJugadorR = round.cardWinxRound.id;

        updatedPlayers = updatedPlayers.map((player) => {
          const cumplio = (player.betP = player.cardsWins);
          if (player.id === round.cardWinxRound.id) {
            return {
              ...player,
              cardsWins: (player.cardsWins || 0) + 1,
              cardBet: {},
              
            };
          }

          return {
            ...player,
            cardBet: {},
            cardsWins: 0,
            cumplio
          };
        });
        // Verificar si los jugadores han cumplido y actualizar puntos

        round.beforeLastCardBet = {};
        round.lastCardBet = {};
        round.cardWinxRound = {};
      }
      //-----------------cambio de mano-----------------
      //-----------------cambio de ronda-----------------
      if (round.hands === round.cardXRound) {
        round.typeRound = "Bet";
        round.obligado = (round.obligado % players.length) + 1;
        round.turnJugadorA = (round.obligado % players.length) + 1; // Cambiar el turno al siguiente jugador
        round.turnJugadorR = (round.obligado % players.length) + 1;
        round.cantQueTiraron = 0;
        round.cantQueApostaron = 0;
        round.cardXRound = round.cardXRound === 7 ? 1 : round.cardXRound + 2;
        round.beforeLastCardBet = {};
        round.lastCardBet = {};
        round.cardWinxRound = {};
        round.betTotal = 0;
        round.hands = 0;

        updatedPlayers = updatedPlayers.map((player) => {
          const cumplio = (player.betP === player.cardsWins);
          const points = cumplio
            ? player.points + 5 + player.betP
            : player.points;

          return {
            ...player,
            cardBet: {},
            // cumplio,
            points,
            betP: 0,
            cardsWins: 0,
          };
        });
      }
      //-----------------cambio de ronda-----------------
      //-----------------Manejo de turnos y Reset-----------------

      io.to(`${game}-${roomId}`).emit("carta_tirada", {
        players: updatedPlayers,
        round,
      });
    } else {
      console.error("It's not the player's turn or invalid round type.");
      socket.emit("error", {
        error: "It's not your turn or invalid round type",
      });
    }
  });
});

server.listen(3001, () => {
  console.log("Server listening on port 3001");
});

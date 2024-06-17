import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import morgan from "morgan";
import "./src/dataBase/connectDB.js";
import AuthRoute from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";

import { distribute, shuffle } from "./functions/functions.js"; // Asegúrate de que estas funciones estén definidas en el archivo adecuado

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});

const permanentRooms = {
  Berenjena: createRooms(10),
  Poker: createRooms(10),
  Truco: createRooms(10),
  Generala: createRooms(10),
};

function createRooms(numberOfRooms) {
  const rooms = {};
  for (let i = 1; i <= numberOfRooms; i++) {
    rooms[i] = {
      users: [],
      disconnectedUsers: [],
      gameStarted: false,
      maxUsers: 6,
      results: [],
    };
  }
  return rooms;
}

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id} to server`);
  //chequear errores de room

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

  socket.on(
    "create_room",
    ({ game, roomId, userName, maxUsers = 6, selectedAvatar, email }) => {
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
        users: [],
        disconnectedUsers: [],
        gameStarted: false,
        maxUsers,
        results: [],
      };

      const user = {
        idSocket: socket.id,
        userName,
        roomId,
        email,
        position: 1,
        ready: false,
        connect: true,
        avatar: selectedAvatar,
        id: 1, // position
        cardPerson: [], // cards
        betP: 0, // num de cards apostadas
        cardsWins: 0, // cards ganadas
        cardBet: {}, // card apostada
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
        typeRound: "Bet", //apuesta o ronda
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
        roomId,
        myInfo: {
          idSocket: user.idSocket,
          userName: user.userName,
          email: user.email,
          position: user.position,
        },
        userName,
        maxUsers,
        round,
      });

      io.to(`${game}-${roomId}`).emit("player_list", {
        users: rooms[roomId].users,
        round: rooms[roomId].round,
      });
    }
  );

  socket.on(
    "join_room",
    ({ game, roomId, userName, selectedAvatar, email }) => {
      const rooms = permanentRooms[game];
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

      const disconnectedUserIndex = room.disconnectedUsers.findIndex(
        (user) => user.email === email || user.userName === userName
      );

      if (disconnectedUserIndex !== -1) {
        const user = room.disconnectedUsers.splice(disconnectedUserIndex, 1)[0];
        user.idSocket = socket.id;
        user.connect = true;
        room.users.push(user);
        console.log(`User ${userName} rejoined room ${roomId} in game ${game}`);
        socket.join(`${game}-${roomId}`);

        socket.emit("room_joined", {
          roomId,
          position: user.position,
          userName,
          round: room.round,
          users: room.users,
        });

        io.to(`${game}-${roomId}`).emit("player_list", {
          users: room.users,
          round: room.round,
        });
        io.to(`${game}-${roomId}`).emit("roomRefresh", {
          users: room.users,
          round: room.round,
          room: room,
        });
        return;
      }

      if (room.gameStarted) {
        socket.emit("room_join_error", {
          error: "Game already started, cannot join",
        });
        return;
      }

      const user = {
        idSocket: socket.id,
        userName,
        roomId,
        email,
        position: room.users.length + 1,
        ready: false,
        connect: true,
        avatar: selectedAvatar,
        id: 1, // position
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

      socket.emit("room_joined", {
        roomId,
        myInfo: {
          idSocket: user.idSocket,
          userName: user.userName,
          email: user.email,
          position: user.position,
        },
        userName,
        users: room.users,
        round: room.round,
      });

      io.to(`${game}-${roomId}`).emit("player_list", {
        users: room.users,
        round: room.round,
      });
    }
  );
  
  socket.on("roomRefresh", ({ game, roomId }) => {
    if (!game || !roomId) {
      return;
    }

    const room = permanentRooms[game]
      ? permanentRooms[game][roomId]
      : undefined;

    if (!room) {
      return;
    }

    io.to(`${game}-${roomId}`).emit("roomRefresh", {
      users: room.users,
      round: room.round,
      room: room,
    });
  });

  // Manejo de desconexión de la sala
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

    if (userIndex !== -1) {
      const disconnectedUser = room.users[userIndex];
      if (room.gameStarted) {
        // Si el juego ya comenzó y un usuario se desconecta,
        // el usuario permanece en la sala pero se marca como desconectado
        disconnectedUser.connect = false;
        room.disconnectedUsers.push(disconnectedUser);
        io.to(`${game}-${roomId}`).emit("player_list", room.users);
        console.log(
          `Usuario ${socket.id} desconectado de la sala ${roomId}. Marcado como desconectado.`
        );
      } else {
        // Si el juego no ha comenzado, el usuario se elimina de la sala
        room.users.splice(userIndex, 1);

        // Actualizar las posiciones de los usuarios restantes
        room.users.forEach((user, index) => {
          user.position = index + 1;
        });

        if (room.users.length === 0) {
          if (roomId <= 10) {
            // Si la sala es una de las primeras 10 creadas (permanente), se vacía y resetea
            room.gameStarted = false;
            room.disconnectedUsers = [];
            console.log(`Sala permanente ${roomId} vaciada y reseteada.`);
          } else {
            // Si la sala no es permanente, se elimina
            delete permanentRooms[game][roomId];
            console.log(
              `Usuario ${socket.id} desconectado de la sala ${roomId}. Sala eliminada.`
            );
          }
        } else {
          // Si hay otros usuarios en la sala, se mantiene la sala
          io.to(`${game}-${roomId}`).emit("player_list", room.users);
          console.log(
            `Usuario ${socket.id} desconectado de la sala ${roomId}.`
          );
        }

        // Enviar posiciones actualizadas a todos los usuarios
        io.to(`${game}-${roomId}`).emit("player_list", room.users);
      }
    } else {
      console.log(`Usuario no encontrado en la sala: ${roomId}`);
    }

    // Envía la lista actualizada a todos los usuarios en la sala
    io.to(`${game}-${roomId}`).emit("player_list", room.users);
  });
  // Manejo de desconexión de la sala

  socket.on("player_ready", ({ game, roomId }) => {
    const room = permanentRooms[game] && permanentRooms[game][roomId];
    if (!room) return;

    const user = room.users.find((u) => u.idSocket === socket.id);
    if (user) {
      user.ready = true;
      io.to(`${game}-${roomId}`).emit("player_ready_status", {
        idSocket: socket.id,
        ready: true,
      });

      const allReady = room.users.every((u) => u.ready);
      if (allReady && room.users.length >= 2) {
        room.gameStarted = true;
        const userObligado = Math.floor(Math.random() * room.users.length);
        const nextTurn = (userObligado + 1) % room.users.length;

        // Actualizar el objeto round
        room.round.obligado = userObligado + 1;
        room.round.turnJugadorA = nextTurn + 1;
        room.round.numRounds = (room.round.numRounds || 0) + 1; // Incrementar la ronda
        room.round.users = room.users.length;

        // Inicializar la ronda actual en results
        const currentRound = { ...room.round, players: [...room.users] };
        room.results.push(currentRound);

        // Emitir el evento de inicio del juego a todos los usuarios en la sala
        io.to(`${game}-${roomId}`).emit("start_game", {
          round: room.round,
          users: room.users,
          results: room.results,
        });
      }
    }
  });

  socket.on("distribute", ({ round, players }) => {
    if (
      !round ||
      !round.roomId ||
      !round.roomId.gameId ||
      !round.roomId.roomId
    ) {
      console.error("Invalid round or roomId object:", round);
      socket.emit("error", { error: "Invalid round or roomId object" });
      return;
    }
    const roomId = round.roomId.roomId;
    const game = round.roomId.gameId;

    try {
      let deck = distribute(); // Obtener el mazo de cartas
      let shuffledCards = shuffle(deck); // Mezclar el mazo de cartas

      const numPlayers = players.length;
      const cardsPerPlayer = round.cardXRound;

      const totalCardsToDistribute = numPlayers * cardsPerPlayer;

      if (shuffledCards.length < totalCardsToDistribute) {
        console.error("Not enough cards to distribute.");
        socket.emit("error", { error: "Not enough cards to distribute" });
        return;
      }

      let distributedCards = {};

      for (let i = 0; i < numPlayers; i++) {
        distributedCards[`player${i + 1}`] = [];

        for (let j = 0; j < cardsPerPlayer; j++) {
          const card = shuffledCards.pop();
          distributedCards[`player${i + 1}`].push(card);
        }
      }
      io.to(`${game}-${roomId}`).emit("distribute", distributedCards);
    } catch (error) {
      console.error("Error in distribute function:", error);
      socket.emit("error", { error: "Error in distribute function" });
    }
  });

  socket.on("BetPlayer", ({ round, players, bet, myPosition }) => {
    // Correctamente accediendo al room ID
    const roomId = round.roomId.roomId;

    const room =
      permanentRooms[round.roomId.gameId] &&
      permanentRooms[round.roomId.gameId][round.roomId.roomId];
    if (!room) return;

    // Actualizar la apuesta del jugador
    const playerIndex = players.findIndex(
      (player) => player.position === myPosition
    );
    if (playerIndex !== -1) {
      players[playerIndex].betP = bet;
    }

    // Encontrar la ronda actual en results
    let currentRound = room.results.find(
      (r) => r.numRounds === round.numRounds
    );

    if (!currentRound) {
      // Si la ronda actual no existe en results, agregarla
      currentRound = {
        ...round,
        players: players.map((player) => ({ ...player })),
      };
      room.results.push(currentRound);
    } else {
      // Actualizar las apuestas en la ronda actual
      const currentRoundPlayerIndex = currentRound.players.findIndex(
        (player) => player.position === myPosition
      );

      if (currentRoundPlayerIndex !== -1) {
        currentRound.players[currentRoundPlayerIndex].betP = bet;
      }
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

    // Emitir el estado actualizado del juego
    io.to(`${round.roomId.gameId}-${roomId}`).emit("update_game_state", {
      round,
      players,
      results: room.results,
    });
  });

  socket.on("tirar_carta", ({ round, players, myPosition, value, suit }) => {
    // -----------------Errores---------------------------
    if (
      !round ||
      !round.roomId ||
      !round.roomId.gameId ||
      !round.roomId.roomId
    ) {
      console.error("Invalid round or roomId object:", round);
      socket.emit("error", { error: "Invalid round or roomId object" });
      return;
    }

    const game = round.roomId.gameId;
    const roomId = round.roomId.roomId;
    const room = permanentRooms[game] && permanentRooms[game][roomId];
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
        round.cardWinxRound =
          round.lastCardBet.value >= round.beforeLastCardBet.value
            ? round.lastCardBet
            : round.beforeLastCardBet;
      }
      //-----------------Saber qué carta es mayor-----------------

      //-----------------Actualizar apuesta de carta jugador-----------------
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
      //-----------------Actualizar apuesta de carta jugador-----------------

      //-----------------Manejo de turnos y Reset-----------------
      round.cantQueTiraron += 1;
      round.turnJugadorR = (round.turnJugadorR % players.length) + 1;
      //-----------------cambio de mano-----------------
      if (round.cantQueTiraron === players.length) {
        round.cantQueTiraron = 0;
        round.hands += 1;
        round.turnJugadorR = round.cardWinxRound.id;
        updatedPlayers = updatedPlayers.map((player) => {
          if (round.cardWinxRound.id === player.id) {
            return { ...player, cardsWins: player.cardsWins + 1 };
          }
          return {
            ...player,
            cardBet: {},
          };
        });

        round.beforeLastCardBet = {};
        round.lastCardBet = {};
        round.cardWinxRound = {};
      }
      //-----------------cambio de mano-----------------

      //-----------------cambio de ronda-----------------
      if (round.hands === round.cardXRound) {
        updatedPlayers = updatedPlayers.map((player) => {
          let points = player.points;
          if (Number(player.betP) === Number(player.cardsWins)) {
            points = Number(player.points) + 5 + Number(player.betP);
          }
          return {
            ...player,
            cardBet: {},
            cumplio: Number(player.betP) === Number(player.cardsWins),
            points,
            betP: 0,
            cardsWins: 0,
          };
        });

        // Actualizar results con la ronda completada
        let currentRound = room.results.find(
          (r) => r.numRounds === round.numRounds
        );
        if (currentRound) {
          currentRound.players = updatedPlayers;
        } else {
          room.results.push({ ...round, players: updatedPlayers });
        }

        // Configurar nueva ronda
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
        round.numRounds += 1;
      }
      //-----------------cambio de ronda-----------------

      //-----------------Manejo de turnos y Reset-----------------

      io.to(`${game}-${roomId}`).emit("carta_tirada", {
        players: updatedPlayers,
        round,
        results: room.results,
      });
    }
  });

  // Manejo de desconexión del servidor
  socket.on("disconnectServer", () => {
    Object.keys(permanentRooms).forEach((game) => {
      const rooms = permanentRooms[game];
      Object.keys(rooms).forEach((roomId) => {
        const room = rooms[roomId];
        const userIndex = room.users.findIndex(
          (user) => user.idSocket === socket.id
        );
        if (userIndex !== -1) {
          const [disconnectedUser] = room.users.splice(userIndex, 1);
          room.disconnectedUsers.push(disconnectedUser);
          io.to(`${game}-${roomId}`).emit("player_list", room.users);

          if (room.users.length === 0) {
            const roomIndex = parseInt(roomId, 10);
            if (roomIndex > 10) {
              delete rooms[roomId];
              console.log(
                `User ${socket.id} Disconnected from room => ${roomId}. Room deleted.`
              );
            } else {
              rooms[roomId] = {
                users: [],
                disconnectedUsers: [],
                gameStarted: false,
                round: {},
                results: [],
              };
              console.log(
                `User ${socket.id} Disconnected from room => ${roomId}. Room left empty.`
              );
            }
          }
        }
      });
    });
    console.log(`User ${socket.id} was disconnected from the server.`);
  });
});

app.use(morgan("dev"));
app.use(express.json());

app.use("/", AuthRoute);
app.use("/user", userRoutes);

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log("Server listening on port", port);
});

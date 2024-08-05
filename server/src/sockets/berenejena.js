
import { distribute, shuffle } from "../functions/functions.js";
import { Player } from "../models/players.js";
import {permanentRooms,handleEmptyRoom } from "./general.js";

export default function BerenjenaSockets(io) {
  io.on("connection", (socket) => {
    
    console.log(`User Connected: ${socket.id} to server`);
    

    socket.on(
      "create_room",
      async ({
        game,
        roomId,
        userName,
        maxUsers = 6,
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

    socket.on(
      "join_room",
      async ({ game, roomId, userName, selectedAvatar, email }) => {
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

        const userInRoom = room.users.find(
          (user) => user.userName === userName || user.email === email
        );

        if (userInRoom) {
          if (!userInRoom.connect && room.gameStarted) {
            // Permitir reconexión si el juego ya ha comenzado y el usuario está en room.users
            userInRoom.idSocket = socket.id;
            userInRoom.connect = true;

            socket.join(`${game}-${roomId}`);
            socket.emit("room_joined", {
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
            socket.emit("room_join_error", {
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
          socket.emit("room_join_error", { error: "Room is full" });
          return;
        }

        if (room.gameStarted) {
          socket.emit("room_join_error", {
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
          userName,
          roomId,
          email: email || "invitado",
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
          idDB,
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
        });

        io.to(`${game}-${roomId}`).emit("player_list", {
          users: room.users,
          round: room.round,
        });
      }
    );
     

    socket.on("roomRefresh", (dataRoom) => {
      if (!dataRoom || !dataRoom.game || !dataRoom.roomId) {
        return;
      }

      const room = permanentRooms[dataRoom.game]
        ? permanentRooms[dataRoom.game][dataRoom.roomId]
        : undefined;

      if (!room) {
        return;
      }

      io.to(`${dataRoom.game}-${dataRoom.roomId}`).emit("roomRefresh", {
        users: room.users,
        round: room.round,
        room: room,
        results: room.results,
      });
    });

    socket.on("player_ready", (dataRoom) => {
      const game = dataRoom.game;
      const roomId = dataRoom.roomId;
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
          io.to(`${game}-${roomId}`).emit("start_game", {
            round: room.round,
            users: room.users,
            results: room.results,
            room: room,
          });
        }
      }
    });

    socket.on("distribute", (dataRoom) => {
      const { game, roomId, round } = dataRoom;

      // Verificar si round y roomId son válidos
      if (!round || !roomId || !game) {
        console.error("Invalid round or roomId object:", dataRoom);
        socket.emit("error", { error: "Invalid round or roomId object" });
        return;
      }

      try {
        let deck = distribute(); // Obtener el mazo de cartas
        let shuffledCards = shuffle(deck); // Mezclar el mazo de cartas

        const room = permanentRooms[game] && permanentRooms[game][roomId];
        if (!room) return;

        const numPlayers = room.users.length;
        const cardsPerPlayer = room.round.cardXRound;

        const totalCardsToDistribute = numPlayers * cardsPerPlayer;

        if (shuffledCards.length < totalCardsToDistribute) {
          console.error("Not enough cards to distribute.");
          socket.emit("error", { error: "Not enough cards to distribute" });
          return;
        }

        for (let i = 0; i < numPlayers; i++) {
          room.users[i].cardPerson = [];

          for (let j = 0; j < cardsPerPlayer; j++) {
            const card = shuffledCards.pop();
            room.users[i].cardPerson.push(card);
          }
        }

        // Emitir evento con usuarios actualizados
        io.to(`${game}-${roomId}`).emit("distribute", { users: room.users });
      } catch (error) {
        console.error("Error in distribute function:", error);
        socket.emit("error", { error: "Error in distribute function" });
      }
    });

    socket.on("BetPlayer", ({ bet, myPosition, dataRoom }) => {
      if (!dataRoom) return;
      const { game, roomId, round } = dataRoom;
      // Verificar si round y roomId son válidos
      if (!round || !roomId || !game) {
        console.error("Invalid round or roomId object:", dataRoom);
        socket.emit("error", { error: "Invalid round or roomId object" });
        return;
      }

      const room =
        permanentRooms[dataRoom.game] &&
        permanentRooms[dataRoom.game][dataRoom.roomId];

      if (!room) return;

      // Actualizar la apuesta del jugador en room.users
      const userIndex = room.users.findIndex(
        (user) => user.position === myPosition
      );

      if (userIndex !== -1) {
        room.users[userIndex].betP = bet;
      }

      // Actualizar la ronda actual en room.results
      let currentRoundIndex = room.results.findIndex(
        (r) => r.round?.numRounds === room.round.numRounds
      );

      const roundData = {
        numRounds: room.round.numRounds,
        cardXRound: room.round.cardXRound,
        obligado: room.round.obligado,
        cardWinxRound: room.round.cardWinxRound,
        ganadorRonda: room.round.ganadorRonda,
      };

      const playersData = room.users.map((user) => ({
        userName: user.userName,
        position: user.position,
        betP: user.betP,
        cardsWins: user.cardsWins,
        cumplio: user.cumplio,
        points: user.points,
      }));

      if (currentRoundIndex !== -1) {
        room.results[currentRoundIndex] = {
          round: roundData,
          players: playersData,
        };
      } else {
        room.results.push({
          round: roundData,
          players: playersData,
        });
      }

      // Determinar el siguiente jugador en turno
      
      room.round.cantQueApostaron += 1;
      room.round.betTotal = Number(room.round.betTotal) + Number(bet);
      room.round.typeRound = "Bet";
      if (room.round.cantQueApostaron === room.users.length) {
        // Cambiar de ronda
        room.round.typeRound = "ronda";
        room.round.turnJugadorR = (room.round.obligado % room.users.length) + 1;
      } else {
        // Continuar con la ronda de apuestas
        let nextTurn = (room.round.turnJugadorA % room.users.length) + 1;
        room.round.turnJugadorA = nextTurn;
      }

      // Emitir el estado actualizado del juego a todos los clientes en la sala
      io.to(`${dataRoom.game}-${roomId}`).emit("update_game_state", {
        round: room.round,
        players: room.users,
        results: room.results,
      });
    });

    socket.on("tirar_carta", ({ myPosition, value, suit, dataRoom }) => {
      if (!dataRoom) return;
      const { game, roomId, round } = dataRoom;
      if (!round || !roomId || !game) {
        console.error("Invalid round or roomId object:", dataRoom);
        socket.emit("error", { error: "Invalid round or roomId object" });
        return;
      }

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

      const card = { value, suit, id: playerIndex + 1 };
      room.users[playerIndex].cardBet = card;

      if (
        room.round.typeRound === "ronda" &&
        myPosition === room.round.turnJugadorR
      ) {
        // Determinar qué carta es mayor
        if (room.round.cantQueTiraron === 0) {
          room.round.lastCardBet = { ...card, playerId: playerIndex + 1 };
          room.round.cardWinxRound = { ...card, playerId: playerIndex + 1 };
        } else {
          room.round.beforeLastCardBet = room.round.lastCardBet;
          room.round.lastCardBet = { ...card, playerId: playerIndex + 1 };

          if (
            room.round.lastCardBet.value > room.round.beforeLastCardBet.value
          ) {
            room.round.cardWinxRound = room.round.lastCardBet;
          } else if (
            room.round.lastCardBet.value < room.round.beforeLastCardBet.value
          ) {
            room.round.cardWinxRound = room.round.beforeLastCardBet;
          } else {
            // Si los valores son iguales, gana la carta que se tiró primero
            room.round.cardWinxRound = room.round.beforeLastCardBet;
          }
        }

        // Actualizar apuesta de carta del jugador en room.users
        room.users[playerIndex].cardBet = card;
        room.users[playerIndex].cardPerson = room.users[
          playerIndex
        ].cardPerson.filter((c) => !(c.value === value && c.suit === suit));

        // Manejo de turnos y reset
        room.round.cantQueTiraron += 1;
        room.round.turnJugadorR =
          (room.round.turnJugadorR % room.users.length) + 1;

        // Cambio de hand
        if (room.round.cantQueTiraron === room.users.length) {
          room.round.cantQueTiraron = 0;
          room.round.hands += 1;
          room.round.turnJugadorR = room.round.cardWinxRound.id;

          room.users.forEach((user, idx) => {
            if (room.round.cardWinxRound.id === idx + 1) {
              user.cardsWins += 1;
            }
            user.cardBet = {};
            if (user.betP === user.cardsWins) {
              user.cumplio = true;
            } else {
              user.cumplio = false;
            }
          });

          // Cambio de hand
        }
        // Cambio de hand

        // Cambio de ronda
        if (room.round.hands === room.round.cardXRound) {
          room.users.forEach((user) => {
            if (user.cumplio === true) {
              user.points += 5 + user.betP;
            }
            user.betP = 0;
            user.cardsWins = 0;
            user.cardBet = {};
          });

          // Actualizar Results de la ronda
          const currentRoundIndex = room.results.findIndex(
            (r) => r.round?.numRounds === room.round.numRounds
          );
          if (currentRoundIndex !== -1) {
            room.results[currentRoundIndex] = {
              round: {
                numRounds: room.round.numRounds,
                cardXRound: room.round.cardXRound,
                obligado: room.round.obligado,
                cardWinxRound: room.round.cardWinxRound,
              },
              players: room.users.map((user) => ({
                userName: user.userName,
                position: user.position,
                betP: user.betP,
                cardsWins: user.cardsWins,
                cumplio: user.cumplio,
                points: user.points,
              })),
            };
          }

          // Actualizar Results de la ronda

          room.users.forEach((user) => {
            user.cumplio = false;
          });

          // Configurar nueva ronda
          room.round.obligado = (room.round.obligado % room.users.length) + 1;
          room.round.turnJugadorA =
            (room.round.obligado % room.users.length) + 1;
          room.round.turnJugadorR =
            (room.round.obligado % room.users.length) + 1;
          room.round.cantQueTiraron = 0;
          room.round.cantQueApostaron = 0;
          room.round.cardXRound =
            room.round.cardXRound === 7 ? 1 : room.round.cardXRound + 2;
          room.round.beforeLastCardBet = {};
          room.round.lastCardBet = {};
          room.round.cardWinxRound = {};
          room.round.betTotal = 0;
          room.round.hands = 0;
          room.round.numRounds += 1;
          //analiza por cada ronda si hay alguien desconectado
          if (room.users.every((user) => user.connect)) {
            room.round.typeRound = "waiting"; //sigue la partida con 5 segundos entre ronda
          } else {
            room.round.typeRound = "waitingPlayers"; //para la partida con 60 segundos
          }

          // Actualizar results con la ronda completada

          const winner = room.users.find((user) => user.points >= 100);

          if (winner) {
            room.round.typeRound = "EndGame";
            const winner = room.users.find((user) => user.points >= 100);

            io.to(`${game}-${roomId}`).emit("GameFinish", {
              players: room.users,
              round: room.round,
              results: room.results,
              winner,
            });
            return; // Finaliza el juego
          }
        }
        // Cambio de ronda

        io.to(`${game}-${roomId}`).emit("carta_tirada", {
          players: room.users,
          round: room.round,
          results: room.results,
        });
      }
    });

    socket.on("EndGame", (dataRoom) => {
      console.log("EndGame event received");
      if (!dataRoom) return;
      const { game, roomId, round } = dataRoom;
      if (!round || !roomId || !game) {
        console.error("Invalid round or roomId object:", dataRoom);
        socket.emit("error", { error: "Invalid round or roomId object" });
        return;
      }

      const room = permanentRooms[game] && permanentRooms[game][roomId];

      if (!room) {
        console.error("Room not found:", roomId);
        return;
      }

      room.round.typeRound = "EndGame";

      const winner = room.users.find((user) => user.points >= 100);

      io.to(`${game}-${roomId}`).emit("GameFinish", {
        players: room.users,
        round: room.round,
        results: room.results,
        winner,
      });
    });

    socket.on("eliminatePlayer", (dataRoom) => {
      const { game, roomId } = dataRoom;

      // Verifica si existen las salas y los jugadores
      if (!permanentRooms[game] || !permanentRooms[game][roomId]) {
        console.log(`Sala no encontrada: ${roomId} en el juego: ${game}`);
        return;
      }

      const room = permanentRooms[game][roomId];

      // Filtra a los jugadores que están desconectados
      room.users = room.users.filter((player) => player.connect);

      // Opcional: Reasigna las posiciones si es necesario
      room.users.forEach((user, index) => {
        user.position = index + 1;
      });

      console.log(`Jugadores desconectados eliminados de la sala ${roomId}.`);
      room.round.typeRound = "waiting";
      room.round.users = room.users.length;
      dataRoom.round = room.round;
      dataRoom.users = room.users;

      io.to(`${game}-${roomId}`).emit("roomRefresh", {
        users: room.users,
        round: room.round,
        room: room,
      });
    });

    // Manejo de desconexión del servidor
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


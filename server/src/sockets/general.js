export function createRooms(numberOfRooms, gameName) {
    const rooms = {};
    for (let i = 1; i <= numberOfRooms; i++) {
      rooms[i] = {
        users: [],
        round: {},
        gameStarted: false,
        maxUsers: 6,
        roomId: i,
        results: [],
        game: gameName,
      };
    }
    return rooms;
  }
  
  export const permanentRooms = {
    Berenjena: createRooms(10, "Berenjena"),
    Horserace: createRooms(10, "Horserace"),
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
  
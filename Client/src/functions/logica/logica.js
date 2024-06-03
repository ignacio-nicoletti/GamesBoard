import { socket } from "../SocketIO/sockets/sockets";

export const distribute = (round, setPlayers, players) => {
  socket.emit("distribute", { round, players });

  socket.on("distribute", (data) => {
 
    setPlayers((prevPlayers) =>
      prevPlayers.map((player, index) => {
        const playerIndex = index + 1;
        return {
          ...player,
          cardPerson: data[`player${playerIndex}`] || [],
        };
      })
    );
  });
};

const comprobarMasGrande = (array, ronda) => {
  let mayor;
  if (array[1].valor === null) {
    mayor = array[0];
    return mayor;
  } else if (array[0].valor !== null && array[1].valor !== null) {
    if (ronda.CardGanadoraxRonda[0].valor < array[0].valor) {
      mayor = array[0];
    } else mayor = ronda.CardGanadoraxRonda[0];
    return mayor;
  }
};

export const AsignarMayor = (value1, value2, ronda, setRonda) => {
  let array = [value1, value2];
  let ganador = comprobarMasGrande(array, ronda);
  setRonda({ ...ronda, CardGanadoraxRonda: [ganador] });
};

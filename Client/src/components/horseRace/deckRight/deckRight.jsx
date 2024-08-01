import { useEffect, useState } from "react";
import Cards from "../cards/cardsHorse";
import styles from "./deckRight.module.css";
import { socket } from "../../../functions/SocketIO/sockets/sockets";

const DeckRight = ({ round, dataRoom, setRound }) => {
  
  const [timerCard, setTimerCard] = useState(3);

  // Función para tirar carta usando promesa
  const tirarCartaHorserace = (dataRoom) => {
    return new Promise((resolve, reject) => {
      // Escuchar solo una vez para evitar duplicados
      const onCardTirada = (data) => {
        resolve(data);
      };

      socket.once("cardTirada_horserace", onCardTirada);

      // Emitir el evento para tirar la carta
      socket.emit("tirarCarta_horserace", dataRoom);
      socket.off("tirarCarta_horserace", dataRoom);
    });
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      setTimerCard((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          if (prevTime === 0 && round.typeRound === "ronda") {
            tirarCartaHorserace(dataRoom).then((data) => setRound(data.round));
          }
          return 3; // Reinicia el temporizador después de emitir el evento
        }
      });
    }, 1000);

    return () => clearInterval(interval); // Clear interval on unmount
  }, [timerCard,round.typeRound]);

  return (
    <div className={styles.cardsContainMazo}>
      {round.cardSuit && (
        <Cards
          value={round.cardSuit.value}
          suit={round.cardSuit.suit}
          back={round.cardSuit.suit === "" ? true : round.cardSuit.back}
        />
      )}
    </div>
  );
};

export default DeckRight;

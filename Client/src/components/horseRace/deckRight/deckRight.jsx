import { useEffect, useState } from "react";
import Cards from "../cards/cardsHorse";
import styles from "./deckRight.module.css";
import { socket, tirarCartaHorserace } from "../../../functions/SocketIO/sockets/sockets";

const DeckRight = ({ round, dataRoom, setRound }) => {

  const [timerCard, setTimerCard] = useState(3);

  // Función para tirar carta usando promesa


  useEffect(() => {
    const interval = setInterval(async () => {
      setTimerCard((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          if (prevTime === 0 && round.typeRound === "ronda") {
            tirarCartaHorserace(dataRoom,setRound);
          }
          return 3; // Reinicia el temporizador después de emitir el evento
        }
      });
    }, 1000);

    return () => clearInterval(interval); // Clear interval on unmount
  }, [timerCard]);

  return (
    <div className={styles.cardsContainMazo}>
      {round&&round.cardSuit && (
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

import { useEffect, useState } from "react";
import Cards from "../cards/cardsHorse";
import styles from "./deckRight.module.css";
import { socket } from "../../../functions/SocketIO/sockets/sockets";

const DeckRight = ({ round, dataRoom ,setRound}) => {
  const [timerCard, setTimerCard] = useState(3);

  useEffect(() => {
    const time = setInterval(() => {
      setTimerCard((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          // Emit the event and reset the timer
          if (prevTime === 0 && round.typeRound === "ronda") {
            socket.emit("tirarCarta_horserace", dataRoom);
          }
          return 3;
        }
      });
    }, 1000);
    return () => clearInterval(time); // Clear interval on unmount
  }, [timerCard]); // Dependency array includes dataRoom and timerCard



  useEffect(() => {
    const handleGameStateUpdate = (data) => {
      setRound(data.round);   
    };
    socket.on("cardTirada_horserace", handleGameStateUpdate);
    return () => {
      socket.off("cardTirada_horserace", handleGameStateUpdate);
      
    };
  }, [round]);


  return (
    <div className={styles.cardsContainMazo}>
      {round.cardSuit && (
        <Cards
          value={round.cardSuit.value}
          suit={round.cardSuit.suit}
          back={round.cardSuit.back ? !round.cardSuit.back : round.cardSuit.back}
        />
      )}
    </div>
  );
};

export default DeckRight;

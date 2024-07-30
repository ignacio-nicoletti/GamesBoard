import React, { useEffect, useState } from "react";
import Cards from "../cards/cardsHorse";
import styles from "./horseContain.module.css";
import { socket } from "../../../functions/SocketIO/sockets/sockets";

const HorseContain = ({ cardSuitUp, setRound, round, dataRoom }) => {
  const [timerCard, setTimerCard] = useState(3);
  const [cardPosY, setCardPosY] = useState({
    cardOro: 5,
    cardEspada: 5,
    cardBasto: 5,
    cardCopa: 5,
  });

  const yClasses = [
    styles.yPos1,
    styles.yPos2,
    styles.yPos3,
    styles.yPos4,
    styles.yPos5,
    styles.yPos6,
  ];

  useEffect(() => {
    if (cardSuitUp && cardSuitUp.suit) {
      const { suit } = cardSuitUp;
      setCardPosY((prevState) => {
        const newState = { ...prevState };
        switch (suit) {
          case "oro":
            newState.cardOro = Math.max(prevState.cardOro - 1, 0);
            break;
          case "espada":
            newState.cardEspada = Math.max(prevState.cardEspada - 1, 0);
            break;
          case "basto":
            newState.cardBasto = Math.max(prevState.cardBasto - 1, 0);
            break;
          case "copa":
            newState.cardCopa = Math.max(prevState.cardCopa - 1, 0);
            break;
          default:
            break;
        }
        return newState;
      });
    }
  }, [cardSuitUp]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimerCard((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else if (prevTime === 0) {
          if (round && round.typeRound === "ronda") {
            if (Object.values(cardPosY).every(pos => pos >= 4)) {
              const suit = round.sideLeftCards[5]?.suit;
              if (suit) {
                setCardPosY((prevState) => {
                  const newState = { ...prevState };
                  switch (suit) {
                    case "oro":
                      newState.cardOro = Math.min(prevState.cardOro + 1, 5);
                      break;
                    case "espada":
                      newState.cardEspada = Math.min(prevState.cardEspada + 1, 5);
                      break;
                    case "basto":
                      newState.cardBasto = Math.min(prevState.cardBasto + 1, 5);
                      break;
                    case "copa":
                      newState.cardCopa = Math.min(prevState.cardCopa + 1, 5);
                      break;
                    default:
                      break;
                  }
                  return newState;
                });
              }
            } else {
              socket.emit("tirarCarta_horserace", dataRoom);
            }
          }
          return 3; // Reset the timer
        }
        return prevTime;
      });
    }, 1000);

    return () => clearInterval(timer); // Clean up the interval on component unmount
  }, [cardPosY, round, dataRoom]);

  useEffect(() => {
    const handleTirarCarta = (data) => {
      setRound(data.round);
    };

    if (round && round.typeRound === "ronda") {
      socket.on("tirarCarta_horserace", handleTirarCarta);
    }

    return () => {
      socket.off("tirarCarta_horserace", handleTirarCarta); // Clean up the socket listener on component unmount
    };
  }, [round, setRound]);

  return (
    <div className={styles.Contain}>
      <div className={`${styles.cards} ${yClasses[cardPosY.cardOro]}`}>
        <Cards value={"11"} suit={"oro"} back={false} />
      </div>
      <div className={`${styles.cards} ${yClasses[cardPosY.cardEspada]}`}>
        <Cards value={"11"} suit={"espada"} back={false} />
      </div>
      <div className={`${styles.cards} ${yClasses[cardPosY.cardBasto]}`}>
        <Cards value={"11"} suit={"basto"} back={false} />
      </div>
      <div className={`${styles.cards} ${yClasses[cardPosY.cardCopa]}`}>
        <Cards value={"11"} suit={"copa"} back={false} />
      </div>
    </div>
  );
};

export default HorseContain;

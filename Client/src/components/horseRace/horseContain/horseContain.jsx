import React, { useEffect, useState } from "react";
import Cards from "../cards/cardsHorse";
import styles from "./horseContain.module.css";

const HorseContain = ({ round, setRound, dataRoom }) => {
 
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
    if (round && round.cardSuit && round.cardSuit.suit) {
      const { suit } = round.cardSuit;
      switch (suit) {
        case "oro":
          setCardPosY((prevState) => ({
            ...prevState,
            cardOro: prevState.cardOro - 1,
          }));
          break;
        case "espada":
          setCardPosY((prevState) => ({
            ...prevState,
            cardEspada: prevState.cardEspada - 1,
          }));
          break;
        case "basto":
          setCardPosY((prevState) => ({
            ...prevState,
            cardBasto: prevState.cardBasto - 1,
          }));
          break;
        case "copa":
          setCardPosY((prevState) => ({
            ...prevState,
            cardCopa: prevState.cardCopa - 1,
          }));
          break;
        default:
          break;
      }
    }
  }, [round]);

 

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

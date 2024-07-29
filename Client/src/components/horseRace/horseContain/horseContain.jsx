import React, { useEffect, useState } from "react";
import Cards from "../cards/cardsHorse";
import styles from "./horseContain.module.css";

const HorseContain = ({ cardSuitUp, cardSuitDown }) => {
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
    if (cardSuitUp && cardSuitUp.suit !== "") {
      const { suit } = cardSuitUp;

      setCardPosY((prevCardPosY) => {
        let newCardPosY = { ...prevCardPosY };

        switch (suit) {
          case "oro":
            newCardPosY.cardOro = prevCardPosY.cardOro - 1;
            break;
          case "espada":
            newCardPosY.cardEspada = prevCardPosY.cardEspada - 1;
            break;
          case "basto":
            newCardPosY.cardBasto = prevCardPosY.cardBasto - 1;
            break;
          case "copa":
            newCardPosY.cardCopa = prevCardPosY.cardCopa - 1;
            break;
          default:
            break;
        }

        return newCardPosY;
      });
    }
  }, [cardSuitUp]);

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

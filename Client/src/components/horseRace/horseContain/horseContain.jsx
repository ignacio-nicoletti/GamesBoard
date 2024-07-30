import React from "react";
import Cards from "../cards/cardsHorse";
import styles from "./horseContain.module.css";

const HorseContain = ({ round }) => {
  const yClasses = [
    styles.yPos0,
    styles.yPos1,
    styles.yPos2,
    styles.yPos3,
    styles.yPos4,
    styles.yPos5,
    styles.yPos6,
  ];
  return (
    <div className={styles.Contain}>
      {round.horseDeck &&
        round.horseDeck.map((el) => (
          <div className={`${styles.cards} ${yClasses[el.pos]}`}>
            <Cards value={el.value} suit={el.suit} back={false} />
          </div>
        ))}
    </div>
  );
};

export default HorseContain;

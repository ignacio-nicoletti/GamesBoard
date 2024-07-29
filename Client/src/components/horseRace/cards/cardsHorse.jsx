import React from "react";
import styles from "./cardsHorse.module.css";
import basto from "../../../assets/berenjena/valores/basto.png";
import copa from "../../../assets/berenjena/valores/copa.png";
import espada from "../../../assets/berenjena/valores/espada.png";
import oro from "../../../assets/berenjena/valores/oro.png";
import backDeck from "../../../assets/horseGame/deckBack.png";

const Cards = ({ value, suit, back }) => {
  const imgPalo = {
    oro: oro,
    espada: espada,
    basto: basto,
    copa: copa,
  };

  return (
    <div className={styles.spanishDeck}>
      {back ? (
        <img
          className={styles.cardImageBack}
          src={backDeck}
          alt="Carta trasera"
        />
      ) : (
        <>
          <div className={styles.topRight}>
            <p className={styles.cardValue}>{value}</p>
          </div>
          <img
            src={imgPalo[suit]}
            alt={`${suit} logo`}
            className={styles.cardImage}
          />
          <div className={styles.bottomLeft}>
            <p className={styles.cardValue}>{value}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default Cards;

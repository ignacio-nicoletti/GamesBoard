import React from "react";
import styles from "./cardsHorse.module.css";
import basto from "../../../assets/berenjena/valores/basto.png";
import copa from "../../../assets/berenjena/valores/copa.png";
import espada from "../../../assets/berenjena/valores/espada.png";
import oro from "../../../assets/berenjena/valores/oro.png";
import backDeck from "../../../assets/horseGame/deckBack.png";
import horseoro from "../../../assets/horseGame/horseoro.png";
import horsebasto from "../../../assets/horseGame/horsebasto.png";
import horseespada from "../../../assets/horseGame/horseespada.png";
import horsecopa from "../../../assets/horseGame/horsecopa.png";

const Cards = ({ value, suit, back }) => {
  const imgPalo = {
    oro: oro,
    espada: espada,
    basto: basto,
    copa: copa,
  };

  const horsePalo = {
    oro: horseoro,
    espada: horseespada,
    basto: horsebasto,
    copa: horsecopa,
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
        <div>
          {value === 11 ? (
            <div>
              <img
                src={horsePalo[suit]}
                alt={`${suit} logo`}
                className={styles.cardImageHorse}
              />
            </div>
          ) : (
            <div>
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
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Cards;

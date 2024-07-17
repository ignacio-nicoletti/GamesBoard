import React from 'react';
import styles from './card.module.css';
import basto from '../../../assets/berenjena/valores/basto.png';
import copa from '../../../assets/berenjena/valores/copa.png';
import espada from '../../../assets/berenjena/valores/espada.png';
import oro from '../../../assets/berenjena/valores/oro.png';
import horseicon from '../../../assets/berenjena/valores/horseicon.png';

const Cards = ({value, suit}) => {
  let imgPalo = {
    oro: oro,
    espada: espada,
    basto: basto,
    copa: copa,
  };

  return (
    <div className={styles.spanishDeck}>
      <div className={styles.topRight}>
        <p className={styles.cardValue}>{value}</p>
      </div>
      <img src={imgPalo[suit]} alt="logoCard" className={styles.cardImage} />
      <div className={styles.bottomLeft}>
        <p className={styles.cardValue}>{value}</p>
      </div>
    </div>
  );
};

export default Cards;

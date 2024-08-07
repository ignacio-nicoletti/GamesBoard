import React from 'react';
import styles from './card.module.css';
import basto from '../../../assets/global/valores/basto.png';
import copa from '../../../assets/global/valores/copa.png';
import espada from '../../../assets/global/valores/espada.png';
import oro from '../../../assets/global/valores/oro.png';

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
      <img
        src={imgPalo[suit]}
        alt="logoCard"
        className={styles.cardImage}
      />
      <div className={styles.bottomLeft}>
        <p className={styles.cardValue}>{value}</p>
      </div>
    </div>
  );
};

export default Cards;

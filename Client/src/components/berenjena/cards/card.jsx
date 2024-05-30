import React, {useEffect, useState} from 'react';
import styles from './card.module.css';
import basto from '../../../assets/berenjena/valores/basto.png';
import copa from '../../../assets/berenjena/valores/copas.png';
import espada from '../../../assets/berenjena/valores/espada.png';
import oro from '../../../assets/berenjena/valores/oro.png';

const Cards = ({value, suit}) => {
  let imgPalo = {
    oro: oro,
    espada: espada,
    basto: basto,
    copa: copa,
  };

  return (
    <div className={styles.spanishDeck}>
      <div className={styles.valueContain}>
        <p style={{display: 'flex', alignSelf: 'flex-end'}}>{value}</p>
        <img
          src={imgPalo[suit]}
          alt="logoCard"
          width={20}
          height={20}
          style={{display: 'flex', alignSelf: 'center', margin: 0}}
        />
        <p style={{display: 'flex', alignSelf: 'flex-start', margin: 0}}>
          {value}
        </p>
      </div>
    </div>
  );
};

export default Cards;

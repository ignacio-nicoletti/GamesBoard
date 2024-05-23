import React from 'react';
import styles from './card.module.css';
import basto from '../../../assets/berenjena/valores/basto.png';
import copa from '../../../assets/berenjena/valores/copas.png';
import espada from '../../../assets/berenjena/valores/espada.png';
import oro from '../../../assets/berenjena/valores/oro.png';

const Cards = ({jugador, setJugador, value, palo, ronda, setRonda, border}) => {
  let imgPalo = {
    oro: oro,
    espada: espada,
    basto: basto,
    copa: copa,
  };

  let deck;
  let valueContain;
  
  if (jugador) {
    if (jugador.id === 1) {
      deck = styles.spanishDeck1;
      valueContain = styles.valueContain1;
    }
    if (jugador.id === 2) {
      deck = styles.spanishDeck2;
      valueContain = styles.valueContain2;
    }
    if (jugador.id === 3) {
      deck = styles.spanishDeck3;
      valueContain = styles.valueContain3;
    }
    if (jugador.id === 4) {
      deck = styles.spanishDeck4;
      valueContain = styles.valueContain4;
    }
  }

  let filterCard;
  const handlerclick = () => {
    if (ronda.typeRound === 'ronda' && jugador.myturnR === true) {
      filterCard = jugador.cardPersona.filter (
        e => e.value !== value || e.palo !== palo
      );

      setJugador ({
        ...jugador,
        cardApostada: [{value, palo}],
        cardPersona: filterCard,
      });

      //tiro la card, la saco del mazo propio y la seteo en la apostada

      if (
        ronda.turnoJugadorR === 1 ||
        ronda.turnoJugadorR === 2 ||
        ronda.turnoJugadorR === 3
      ) {
        setRonda ({
          ...ronda,
          AnteultimaCardApostada: ronda.ultimaCardApostada,
          ultimaCardApostada: [{value, palo, id: jugador.id}],
          turnoJugadorR: ronda.turnoJugadorR + 1,
          cantQueTiraron: ronda.cantQueTiraron + 1,
        }); //setea la card apostada en la ultima y lo que habia en ultima pasa a ser anteultima
      } else {
        setRonda ({
          ...ronda,
          turnoJugadorR: 1,
          AnteultimaCardApostada: ronda.ultimaCardApostada,
          ultimaCardApostada: [{value, palo, id: jugador.id}],
          cantQueTiraron: ronda.cantQueTiraron + 1,
        });
      }
    }
    //cambio de turno al que me sigue y seteo laultima card con el id y paso la ult a la anteult
  };

  return (
    <div className={deck} style={{border: border}}>
      <div className={valueContain} onClick={() => handlerclick ()}>

        <p style={{display: 'flex', alignSelf: 'flex-end'}}>{value}</p>
        <img
          src={imgPalo[palo]}
          alt="logoCard"
          width={20}
          height={20}
          style={{display: 'flex', alignSelf: 'center', margin: 0}}
        />
        <p
          style={{
            display: 'flex',
            alignSelf: 'flex-start',
            margin: 0,
          }}
        >
          {value}
        </p>
      </div>
    </div>
  );
};

export default Cards;

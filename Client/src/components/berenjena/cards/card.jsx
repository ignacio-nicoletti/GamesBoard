import React from 'react';
import styles from './card.module.css';
import basto from '../../../assets/berenjena/valores/basto.png';
import copa from '../../../assets/berenjena/valores/copas.png';
import espada from '../../../assets/berenjena/valores/espada.png';
import oro from '../../../assets/berenjena/valores/oro.png';

const Cards = ({players, setPlayers, value, suit, round, setRound}) => {
  let imgPalo = {
    oro: oro,
    espada: espada,
    basto: basto,
    copa: copa,
  };

  const handlerclick = () => {
    //   if (round.typeRound === 'ronda' && jugador.myturnR === true) {
    //     filterCard = jugador.cardPersona.filter (
    //       e => e.value !== value || e.psuitalo !== suit
    //     );
    //     setJugador ({
    //       ...jugador,
    //       cardApostada: [{value, suit}],
    //       cardPersona: filterCard,
    //     });
    //     //tiro la card, la saco del mazo propio y la seteo en la apostada
    //     if (
    //       ronda.turnoJugadorR === 1 ||
    //       ronda.turnoJugadorR === 2 ||
    //       ronda.turnoJugadorR === 3
    //     ) {
    //       setRonda ({
    //         ...ronda,
    //         AnteultimaCardApostada: ronda.ultimaCardApostada,
    //         ultimaCardApostada: [{value, suit, id: jugador.id}],
    //         turnoJugadorR: ronda.turnoJugadorR + 1,
    //         cantQueTiraron: ronda.cantQueTiraron + 1,
    //       }); //setea la card apostada en la ultima y lo que habia en ultima pasa a ser anteultima
    //     } else {
    //       setRonda ({
    //         ...ronda,
    //         turnoJugadorR: 1,
    //         AnteultimaCardApostada: ronda.ultimaCardApostada,
    //         ultimaCardApostada: [{value, suit, id: jugador.id}],
    //         cantQueTiraron: ronda.cantQueTiraron + 1,
    //       });
    //     }
    //   }
    //   //cambio de turno al que me sigue y seteo laultima card con el id y paso la ult a la anteult
  };

  return (
    <div className={styles.spanishDeck}>
      <div className={styles.valueContain} onClick={() => handlerclick ()}>

        <p style={{display: 'flex', alignSelf: 'flex-end'}}>{value}</p>
        <img
          src={imgPalo[suit]}
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

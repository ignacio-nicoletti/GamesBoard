import React from 'react';
import styles from './jugadores.module.css';
import person from '../../../assets/berenjena/jugadores/avatar.png';
import backface from '../../../assets/berenjena/valores/backface.png';
import cardsIcon from '../../../assets/berenjena/jugadores/cartas.png';

import Cards from '../cards/card';
const Jugadores = ({jugador, setJugador, setRonda, ronda}) => {
  let estiloJugador;
  let divAlinearCards;
  let alinearCards;
  let cardApost;

  if (jugador.id === 4) {
    estiloJugador = styles.AcomodarCard4;
    divAlinearCards = styles.card4;
    cardApost = styles.cardApost4;
  }
  if (jugador.id === 3) {
    estiloJugador = styles.AcomodarCard3;
    divAlinearCards = styles.card3;
    cardApost = styles.cardApost3;
  }
  if (jugador.id === 2) {
    estiloJugador = styles.AcomodarCard2;
    divAlinearCards = styles.divCard2;
    alinearCards = styles.card2;
    cardApost = styles.cardApost2;
  }

  return (
    <div className={estiloJugador}>
      <div className={styles.divJugador}>

        <div className={styles.avatar}>
          <img src={person} alt="persona" width={150} height={100} />
          <p style={{margin: 0}}>aaaaaaaaaaaaaaa {jugador.username}</p>
        </div>
        <div className={styles.cards}>
          <img src={cardsIcon} alt="" />
        </div>
      </div>

      <div>

        {/* <div className={alinear}>
          {jugador.cardPersona.map ((e ,index)=> (
            <div className={cardalign} style={{gap:"50"}} key={index}>
            <Image src={backface} alt="backface Card" width={30} height={30}  style={{transform:rotate}}/>
            </div>
            ))}
          </div> */}
        <div className={divAlinearCards}>
          {jugador.cardPersona.map ((card, index) => (
            <div className={alinearCards}>

              <Cards
                key={index}
                valor={card.valor}
                palo={card.palo}
                jugador={jugador}
                setJugador={setJugador}
                setRonda={setRonda}
                ronda={ronda}
              />
            </div>
          ))}
        </div>

        <div className={divAlinearCards}>
          {jugador.cardApostada[0].valor &&
            jugador.cardApostada.map ((card, index) => (
              <div className={cardApost}>
                <Cards
                  key={index}
                  valor={card.valor}
                  palo={card.palo}
                  jugador={jugador}
                />
              </div>
            ))}
        </div>

      </div>

    </div>
  );
};

export default Jugadores;

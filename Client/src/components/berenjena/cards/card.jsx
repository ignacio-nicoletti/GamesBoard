import React, { useEffect, useState } from 'react';
import styles from './card.module.css';
import basto from '../../../assets/berenjena/valores/basto.png';
import copa from '../../../assets/berenjena/valores/copas.png';
import espada from '../../../assets/berenjena/valores/espada.png';
import oro from '../../../assets/berenjena/valores/oro.png';
import { socket } from '../../../functions/SocketIO/sockets/sockets';

const Cards = ({ players, setPlayers, value, suit, round, setRound, myPosition }) => {
  let imgPalo = {
    oro: oro,
    espada: espada,
    basto: basto,
    copa: copa,
  };

  const [cartaTirada, setCartaTirada] = useState(null);
const game="Berenjena"
  useEffect(() => {
    // Escuchar el evento del servidor que indica que se ha tirado una carta
    socket.on('carta_tirada', ({ myPosition, value, suit }) => {
      // Actualizar el estado con la carta tirada
 
    });

    // Limpiar el listener del evento cuando el componente se desmonta
    return () => {
      socket.off('carta_tirada');
    };
  }, []);

  const handlerClick = () => {
    // Verificar si es el turno del jugador para tirar una carta durante la ronda
    if (round && round.typeRound === 'ronda' && myPosition === round.turnJugadorR) {
      // Emitir evento al backend indicando que el jugador ha tirado una carta
      console.log("emitido");
      socket.emit('tirar_carta', {game, myPosition, value, suit, round, roomId: round.roomId,players });
    }
  };

  return (
    <div className={styles.spanishDeck}>
      <div className={styles.valueContain} onClick={() => handlerClick()}>
        <p style={{ display: 'flex', alignSelf: 'flex-end' }}>{value}</p>
        <img
          src={imgPalo[suit]}
          alt="logoCard"
          width={20}
          height={20}
          style={{ display: 'flex', alignSelf: 'center', margin: 0 }}
        />
        <p style={{ display: 'flex', alignSelf: 'flex-start', margin: 0 }}>{value}</p>
      </div>
      {cartaTirada && (
        <div>
          <p>{`Carta tirada por jugador ${cartaTirada.myPosition}: ${cartaTirada.value} de ${cartaTirada.suit}`}</p>
        </div>
      )}
    </div>
  );
};

export default Cards;

import {useEffect} from 'react';
import Cards from '../cards/card';
import styles from './myCards.module.css';
import {socket} from '../../../functions/SocketIO/sockets/sockets';

const MyCards = ({myPosition, players, setPlayers, setRound, round}) => {
  const player = players[myPosition - 1];

  const handlerClick = (suit, value) => {
    // Verificar si es el turno del jugador para tirar una carta durante la ronda
    if (
      round &&
      round.typeRound === 'ronda' &&
      myPosition === round.turnJugadorR
    ) {
      // Emitir evento al backend indicando que el jugador ha tirado una carta
      socket.emit ('tirar_carta', {
        round,
        players,
        myPosition,
        value,
        suit,
      });
    }
  };

  useEffect (
    () => {
      socket.on ('carta_tirada', ({players, round}) => {
        setPlayers (players);
        setRound (round);
      });

      return () => {
        socket.off ('carta_tirada');
      };
    },
    [players, round]
  );

  return (
    <div className={styles.MyCardsContainer}>
      {/* Renderizar cartas de cardPerson si existen */}
      {player &&
        player.cardPerson &&
        player.cardPerson.map ((card, index) => (
          <div
            key={index}
            onClick={() => handlerClick (card.suit, card.value)}
            className={styles.MyCards}
          >
            <Cards value={card.value} suit={card.suit} />
          </div>
        ))}
      {/* Mostrar la carta apostada solo si existe */}
      {player && player.cardBet.value
        ? <div style={{background: 'red'}} className={styles.MyCardBet}>
            <Cards value={player.cardBet.value} suit={player.cardBet.suit} />
          </div>
        : ''}
    </div>
  );
};

export default MyCards;
import {useEffect} from 'react';
import Cards from '../cards/card';
import styles from './myCards.module.css';
import {socket} from '../../../functions/SocketIO/sockets/sockets';

const MyCards = ({
  myPosition,
  players,
  setPlayers,
  setRound,
  round,
  setTimmerPlayer,
  timmerPlayer,
  setResults ,
  dataRoom
}) => {
  const player = players[myPosition - 1];

  const handlerClick = (suit, value) => {
    // Verificar si es el turno del jugador para tirar una carta durante la ronda
    if (
      round &&
      round.typeRound === 'ronda' &&
      myPosition === round.turnJugadorR
    ) {
      // Emitir evento al backend indicando que el jugador ha tirado una carta
      setTimmerPlayer(30);
      socket.emit('tirar_carta', {
        myPosition,
        value,
        suit,
        dataRoom
      });
    }
  };

  useEffect(() => {
    socket.on('carta_tirada', (data) => {
      setPlayers(data.players);
      setRound(data.round);
      setResults(data.results);
    });

    return () => {
      socket.off('carta_tirada');
    };
  }, [round]);

  useEffect(() => {
    if (timmerPlayer === 0) {
      const randomIndex = Math.floor(
        Math.random() * player?.cardPerson.length
      );
      const randomCard = player?.cardPerson[randomIndex];

      randomCard &&
        socket.emit('tirar_carta', {
          round,
          players,
          myPosition,
          value: randomCard.value,
          suit: randomCard.suit,
        });
      setTimmerPlayer(30);
    }
  }, [timmerPlayer]);

  return (
    <div className={styles.MyCardsContainer}>
      {/* Renderizar cartas de cardPerson si existen */}
      {player &&
        player.cardPerson &&
        player.cardPerson.map((card, index) => (
          <div
            key={index}
            onClick={() => handlerClick(card.suit, card.value)}
            className={styles.MyCards}
          >
            <Cards value={card.value} suit={card.suit} />
          </div>
        ))}
      {/* Mostrar la carta apostada solo si existe */}
      {player && player.cardBet.value ? (
        <div className={styles.MyCardBet}>
          <Cards value={player.cardBet.value} suit={player.cardBet.suit} />
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default MyCards;

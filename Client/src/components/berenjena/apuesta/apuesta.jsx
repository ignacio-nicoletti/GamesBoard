import React, {useEffect, useState} from 'react';
import style from './apuesta.module.css';
import {socket} from '../../../functions/SocketIO/sockets/sockets';

const Apuesta = ({
  players,
  setPlayers,
  round,
  roomId,
  setRound,
  myPosition,
  game,
}) => {
  const [bet, setBet] = useState (0);

  const apostar = event => {
    setBet (event.target.value);
  };

  const handleSubmit = () => {
    socket.emit ('BetPlayer', {game, roomId, round, players, bet, myPosition});
  };

  useEffect (
    () => {
      socket.on ('update_game_state', ({round, players}) => {
        setRound (round);
        setPlayers (players);
      });

      return () => {
        socket.off ('update_game_state');
      };
    },
    [setRound, setPlayers]
  );
  return (
    <div>
      {round.turnJugadorA === myPosition
        ? <div className={style.contain}>
            <p>jugador {round.turnJugadorA}</p>
            <select name="select" onChange={event => apostar (event)}>
              <option value={'Elige tu apuesta'} disabled={true}>
                {' '}Elige tu apuesta{' '}
              </option>
              {[...Array (round.cardXRound + 1)].map ((_, index) => (
                <option
                  key={index}
                  value={index}
                  // disabled={
                  //   myPosition == round.obligado && index + round.betTotal === round.cardXRound
                  //     ? true
                  //     : false
                  // }
                >
                  {index} cartas
                </option>
              ))}
            </select>
            <button onClick={handleSubmit}>Apostar</button>
          </div>
        : <div className={style.contain}>
            <p>jugador {round.turnJugadorA} apostando...</p>
          </div>}
    </div>
  );
};

export default Apuesta;

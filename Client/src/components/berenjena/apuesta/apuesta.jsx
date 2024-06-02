import React, {useEffect, useState} from 'react';
import style from './apuesta.module.css';
import {socket} from '../../../functions/SocketIO/sockets/sockets';

const Apuesta = ({players, setPlayers, round, setRound, myPosition}) => {
  const [bet, setBet] = useState (0);
  const [timeLeft, setTimeLeft] = useState (30);

  const handleSubmit = () => {
    socket.emit ('BetPlayer', {round, players, bet, myPosition});
  };

  useEffect (() => {
    const timer = setInterval (() => {
      setTimeLeft (prevTime => prevTime - 1);
    }, 1000);
    return () => clearInterval (timer);
  }, []);

  useEffect (
    () => {
      if (timeLeft === 0) {
        const availableBets = [...Array (round.cardXRound + 1)]
          .map ((_, index) => index)
          .filter (
            index =>
              !(myPosition === round.obligado &&
                index + round.betTotal === round.cardXRound)
          );

        const randomBet =
          availableBets[Math.floor (Math.random () * availableBets.length)];

        socket.emit ('BetPlayer', {round, players, bet: randomBet, myPosition});
      }
    },
    [timeLeft, round, players, myPosition]
  );

  useEffect (
    () => {
      socket.on ('update_game_state', ({round, players}) => {
        setTimeLeft (30);
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
            <p>Tiempo restante: {timeLeft} segundos</p>
            <p>jugador {round.turnJugadorA}</p>
            <select
              name="select"
              onClick={event => setBet (event.target.value)}
            >
              <option value={'Elige tu apuesta'} disabled={true}>
                {' '}Elige tu apuesta{' '}
              </option>
              {[...Array (round.cardXRound + 1)].map ((_, index) => (
                <option
                  key={index}
                  value={index}
                  disabled={
                    myPosition === round.obligado &&
                      index + round.betTotal === round.cardXRound
                      ? true
                      : false
                  }
                >
                  {index} cartas
                </option>
              ))}
            </select>
            <button onClick={handleSubmit}>Apostar</button>
          </div>
        : <div className={style.contain}>
            <p>jugador {round.turnJugadorA} apostando...</p>
            <p>Tiempo restante: {timeLeft} segundos</p>
          </div>}
    </div>
  );
};

export default Apuesta;

import React, {useEffect, useState} from 'react';
import style from './apuesta.module.css';
import {socket} from '../../../functions/SocketIO/sockets/sockets';

const Apuesta = ({
  players,
  setPlayers,
  round,
  setRound,
  myPosition,
}) => {
  const [bet, setBet] = useState (0);

//preparar el temporizador con useEffect y sino apuesta socket 
  const handleSubmit = () => {
    socket.emit ('BetPlayer', { round, players, bet, myPosition});
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
    []
  );
  return (
    <div>
      {round.turnJugadorA === myPosition
        ? <div className={style.contain}>
            <p>jugador {round.turnJugadorA}</p>
            <select name="select" onClick={event =>  setBet(event.target.value)}>
              <option value={'Elige tu apuesta'} disabled={true}>
                {' '}Elige tu apuesta{' '}
              </option>
              {[...Array (round.cardXRound + 1)].map ((_, index) => (
                <option
                  key={index}
                  value={index}
                  disabled={
                    myPosition == round.obligado && index + round.betTotal === round.cardXRound
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
          </div>}
    </div>
  );
};

export default Apuesta;

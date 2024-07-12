import React, {useEffect, useRef, useState} from 'react';
import style from './dataPlayer.module.css';
import avatar1 from '../../../../assets/berenjena/jugadores/avatar1.png';
import avatar2 from '../../../../assets/berenjena/jugadores/avatar2.png';
import avatar3 from '../../../../assets/berenjena/jugadores/avatar3.png';
import avatar4 from '../../../../assets/berenjena/jugadores/avatar4.png';
import avatar5 from '../../../../assets/berenjena/jugadores/avatar5.png';
import avatar6 from '../../../../assets/berenjena/jugadores/avatar6.png';
import {faStar} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const DataPlayer = ({players, myPosition, timmerPlayer, round}) => {
  const [player, setPlayer] = useState ({});
  const [progress, setProgress] = useState (100);
  const intervalRef = useRef (null);
  const totalTime = 30;
  const progressRef = useRef (null);

  const getProgressColor = () => {
    const percent = progress / 100;
    const red = Math.min (255, Math.floor ((1 - percent) * 255));
    const green = Math.min (255, Math.floor (percent * 255));
    return `rgb(${red},${green},0)`;
  };
  useEffect (
    () => {
      const playerPos = players[myPosition - 1];
      if (playerPos) {
        setPlayer (playerPos);
      }
    },
    [players, myPosition]
  );

  useEffect (
    () => {
      if (round.turnJugadorR === player.position) {
        setProgress (timmerPlayer / totalTime * 100);

        intervalRef.current = setInterval (() => {
          setProgress (prev => {
            const newProgress = prev - 100 / totalTime;
            return newProgress >= 0 ? newProgress : 0;
          });
        }, 1000);

        return () => clearInterval (intervalRef.current);
      }
    },
    [round.turnJugadorR, player.position, timmerPlayer]
  );

  const avatarMap = {
    avatar1: avatar1,
    avatar2: avatar2,
    avatar3: avatar3,
    avatar4: avatar4,
    avatar5: avatar5,
    avatar6: avatar6,
  };

  let playerAvatar = avatarMap[player.avatar];
  // Determinar si se cumplió la condición
  const isFulfilled = player.cumplio;

  return (
    <div className={style.infoPropia}>
      <div className={style.table_component} role="region" tabIndex="0">
        <table>
          <thead>
            <tr>
              <th colSpan="2">Score</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Bets</td>
              <td>{player.betP}</td>
            </tr>
            <tr>
              <td>Wins</td>
              <td>{player.cardsWins}</td>
            </tr>
            <tr>
              <td>Points</td>
              <td>{player.points}</td>
            </tr>
            <tr>
              <td>Cumplió</td>

              <td
                className={isFulfilled ? style.fulfilled : style.notFulfilled}
              >
                {isFulfilled
                  ? <div>
                      Cumplió
                      {/* <CheckCircleIcon className={style.icon} /> */}
                    </div>
                  : <div>
                      No Cumplió
                      {/* <CancelIcon className={style.icon} /> */}
                    </div>}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={style.avatar}>
        {round.obligado === player.position &&
          <FontAwesomeIcon
            icon={faStar}
            className={style.obligatedIcon}
            title="Obligado"
          />}
        <img src={playerAvatar} alt="Avatar" />
        <span className={style.name}>
          {player.userName ? player.userName : 'Jugador'}
        </span>
        {round.typeRound === 'ronda' && round.turnJugadorR === myPosition
          ? <div className={style.progressBar}>
              <div
                className={style.progress}
                style={{
                  width: `${progress}%`,
                  backgroundColor: getProgressColor (),
                }}
              />
            </div>
          : ''}

      </div>
    </div>
  );
};

export default DataPlayer;

import {useEffect, useState} from 'react';
import styles from './timmerComponent.module.css';
import PersonIcon from '@mui/icons-material/Person';
import CheckIcon from '@mui/icons-material/Check';
import {socket} from '../../../functions/SocketIO/sockets/sockets';

const TimmerComponent = ({timmerTicks, setRound, round, players, dataRoom}) => {
  const [timmer, settimmer] = useState (timmerTicks);
  const [ListCheck, setListCheck] = useState ([]);
  useEffect (
    () => {
      setListCheck (players.filter (player => player.cumplio));

      if (!round) return;

      let initialTime = 0;
      if (round.typeRound === 'waiting') {
        initialTime = 5;
      } else if (round.typeRound === 'waitingPlayers') {
        initialTime = 60;
      }
      settimmer (initialTime);

      const time = setInterval (() => {
        settimmer (prevTime => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else {
            clearInterval (time);

            if (round.typeRound === 'waiting') {
              setRound ({...round, typeRound: 'Bet'});
            } else if (round.typeRound === 'waitingPlayers') {
              if (players.every (player => player.connect)) {
                setRound ({...round, typeRound: 'Bet'});
              } else {
                if (players.length <= 2) {
                  setRound ({...round, typeRound: 'EndGame'});
                } else if (players.length > 2) {
                  socket.emit ('eliminatePlayer', dataRoom);
                }
              }
            }

            return 0;
          }
        });
      }, 1000);

      return () => clearInterval (time);
    },
    [round.typeRound, players]
  );

  return (
    <div className={styles.container}>
      {round.typeRound === 'waiting'
        ? <div>
            {round.numRounds === 1
              ? <h3 className={styles.message}>
                  Comenzando Partida:
                  {' '}
                  <span className={styles.timer}>{timmer}</span>
                </h3>
              : <div>
                  <p>Cumplieron:</p>
                  {ListCheck &&
                    ListCheck.map (player => <p>{player.userName}</p>)}
                  <h3 className={styles.message}>

                    Preparando siguiente ronda:
                    {' '}
                    <span className={styles.timer}>{timmer}</span>
                  </h3>
                </div>}
          </div>
        : round.typeRound === 'waitingPlayers'
            ? <div>
                <h3 className={styles.message}>
                  Esperando jugadores:
                  {' '}
                  <span className={styles.timer}>{timmer}</span>
                </h3>

                {players.length > 0 &&
                  players.map (
                    player =>
                      player.connect
                        ? <CheckIcon
                            key={player.idSocket}
                            sx={{fontSize: 50, color: '#ff904f'}}
                            alt="Current Player"
                            className={`${styles.playerImage} ${styles.ready}`}
                          />
                        : <PersonIcon
                            key={player.idSocket}
                            sx={{fontSize: 50}}
                            alt="Current Player"
                            className={styles.playerImage}
                          />
                  )}
              </div>
            : ''}
    </div>
  );
};

export default TimmerComponent;

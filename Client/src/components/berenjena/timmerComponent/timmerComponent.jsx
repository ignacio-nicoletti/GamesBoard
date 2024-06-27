import {useEffect, useState} from 'react';
import styles from './timmerComponent.module.css';
import PersonIcon from '@mui/icons-material/Person';
import CheckIcon from '@mui/icons-material/Check';

const TimmerComponent = ({
  showTimmer,
  setShowTimmer,
  timmerTicks,
  setRound,
  round,
  players,
}) => {
  const [timmer, settimer] = useState (timmerTicks);
  // Timmer entre rondas

  useEffect (
    () => {
      settimer (timmer); // Inicias con el valor deseado
      const time = setInterval (() => {
        settimer (prevTime => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else {
            clearInterval (time);
            setShowTimmer (false);
            if (round.typeRound === 'waiting') {
              setRound ({...round, typeRound: 'Bet'});
            }

            return 0;
          }
        });
      }, 1000);
      return () => clearInterval (time);
    },
    [round.typeRound]
  );

  return (
    <div className={styles.container}>
      {round && round.typeRound === 'waiting'
        ? <div>
            <h3 className={styles.message}>
              Tiempo de espera:{' '}
              <span className={styles.timer}>{timmer}</span>
            </h3>
          </div>
        : round &&round.round.typeRound === 'waitingPlayer'
            ? <div>
                <h3 className={styles.message}>
                  Esperando jugadores:{' '}
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
            :""}
    </div>
  );
};

export default TimmerComponent;

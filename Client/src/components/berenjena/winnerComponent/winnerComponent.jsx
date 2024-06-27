import {useEffect, useState} from 'react';
import styles from './winnerComponent.module.css';
import {useNavigate} from 'react-router-dom';
import {disconnectRoom} from '../../../functions/SocketIO/sockets/sockets';
import InstanceOfAxios from '../../../utils/intanceAxios';
const WinnerComponent = ({winner, room}) => {
  const [timmerFinishRoom, setTimmerFinishRoom] = useState (10);

  const navigate = useNavigate ();

  const AddExperience = async () => {
    if (winner && winner.idDB) {
      await InstanceOfAxios (`/user/addexperience/${winner.idDB}`, 'PUT', {
        room,
      });
    }
  };

  useEffect (
    () => {
      const time = setInterval (() => {
        setTimmerFinishRoom (prevTime => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else {
            clearInterval (time);
            return 0;
          }
        });
      }, 1000);

      if (timmerFinishRoom === 0) {
        disconnectRoom (room.game, room.roomId);
        navigate (`/berenjena/joinRoom`);
        AddExperience ();
      }

      return () => clearInterval (time);
    },
    [timmerFinishRoom]
  );

  return (
    <div className={styles.containWinner}>
      <p>Ganador del juego: jugador {winner.userName}</p>
      <p>La sala cerrara en : {timmerFinishRoom}</p>
    </div>
  );
};

export default WinnerComponent;

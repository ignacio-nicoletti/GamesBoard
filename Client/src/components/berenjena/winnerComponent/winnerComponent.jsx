import {useEffect, useState} from 'react';
import styles from './winnerComponent.module.css';
import {useNavigate} from 'react-router-dom';
import {disconnectRoom} from '../../../functions/SocketIO/sockets/sockets';
import InstanceOfAxios from '../../../utils/intanceAxios';
const WinnerComponent = ({winner, room, players}) => {
  const [timmerFinishRoom, setTimmerFinishRoom] = useState (10);

  const navigate = useNavigate ();

  const AddExperience = async () => {
    await InstanceOfAxios (`/user/addexperience/`, 'PUT', {
      winner,
      room,
      players,
    });
  };

  useEffect (
    () => {
      AddExperience ();
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
      }

      return () => clearInterval (time);
    },
    [timmerFinishRoom]
  );

  return (
    <div className={styles.containWinner}>
      <div className={styles.BoxWinner}>
        <h2>Game Over</h2>
        <p>{winner.userName} is winner</p>
        <p className={styles.message}>
          The room will close in: {timmerFinishRoom}
        </p>
      </div>
    </div>
  );
};

export default WinnerComponent;

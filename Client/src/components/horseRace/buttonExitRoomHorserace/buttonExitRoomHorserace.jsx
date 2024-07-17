import React from 'react';
import {Link, useParams} from 'react-router-dom';
import style from './buttonExitRoomHorserace.module.css';
import {socket} from '../../../functions/SocketIO/sockets/sockets';

const ButtonExitRoomHorserace = () => {
  const {id} = useParams ();
  const game = 'Berenjena';

  const handlerExitRoom = () => {
    socket.emit ('disconnectRoom', {game, roomId: id});
  };

  return (
    <div className={style.container}>
      <Link
        to="/horserace/joinRoom"
        onClick={handlerExitRoom}
        className={style.ButtonExitRoom}
      >
        <p className={style.link}>Exit Room</p>
      </Link>
    </div>
  );
};

export default ButtonExitRoomHorserace;

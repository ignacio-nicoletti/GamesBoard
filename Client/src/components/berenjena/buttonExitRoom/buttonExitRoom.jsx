import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import style from './buttonExitRoom.module.css';
import {disconnectRoom} from '../../../functions/SocketIO/sockets/sockets';

const ButtonExitRoom = ({game}) => {
  const {id} = useParams ();
  const [roomId, setRoomId] = useState (id);
  
  useEffect (
    () => {
      return () => {
        disconnectRoom (game, roomId);
      };
    },
    [game, roomId]
  );

  const handlerExitRoom = () => {
    setRoomId(id)
    disconnectRoom (game, roomId);
  };

  return (
    <div className={style.container}>
      <Link
        to="/berenjena"
        onClick={handlerExitRoom}
        className={style.ButtonExitRoom}
      >
        <p className={style.link}>Exit Room</p>
      </Link>
    </div>
  );
};

export default ButtonExitRoom;

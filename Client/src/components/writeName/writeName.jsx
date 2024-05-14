import {
  connectSocket,
  EmitAsignar,
  joinGameRoom,
  OnSalaLLena,
} from '../../functions/SocketIO/sockets/sockets';
import socketService from '../../functions/SocketIO/socketService';

import {useState} from 'react';
import style from './writeName.module.css';

export const WriteName = ({
  setWriteName,
  setJugador1,
  jugador1,
  setJugador2,
  jugador2,
  setJugador3,
  jugador3,
  setJugador4,
  jugador4,
}) => {
  const [roomId, setRoomId] = useState ('');
  const [userName, setUserName] = useState ('');

  const socket = socketService.socket;

  const joinRoom = async e => {
    e.preventDefault ();

    let join = await joinGameRoom (socket, roomId, userName).catch (err => {
      alert (err);
    });
    setWriteName (!join);

    if (join) {
      let data = await OnSalaLLena (socket);
      setJugador1 ({...jugador1, username: data.jugadores.jugador1.username});
      setJugador2 ({...jugador2, username: data.jugadores.jugador2.username});
      setJugador3 ({...jugador3, username: data.jugadores.jugador3.username});
      setJugador4 ({...jugador4, username: data.jugadores.jugador4.username});

      if (data) {
        EmitAsignar (socket, roomId);
      }

      //   if (roomId !== "") {
      //     socket.emit("join_room", roomId);
    }
  };
  return (
    <div className={style.contain}>
      <p>Ingresa tu id</p>
      <form onSubmit={joinRoom}>

        <input
          type="text"
          placeholder="Nombre"
          value={userName}
          onChange={e => setUserName (e.target.value)}
        />
        <input
          type="number"
          placeholder="Numero de sala"
          value={roomId}
          onChange={e => setRoomId (e.target.value)}
        />
        <button type="submit">enviar</button>
      </form>
    </div>
  );
};

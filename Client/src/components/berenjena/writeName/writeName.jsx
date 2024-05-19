import {
  joinGameRoom,
  OnSalaLLena,
  socket,
} from '../../../functions/SocketIO/sockets/sockets';

import {useEffect, useState} from 'react';
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
  setJugador5,
  jugador5,
  setJugador6,
  jugador6,
  setMyPosition,
  setSala,
}) => {
  const [roomId, setRoomId] = useState ('');
  const [userName, setUserName] = useState ('');

  const joinRoom = async e => {
    e.preventDefault ();

    setWriteName (false);
    const response = await joinGameRoom ("Berenjena",roomId, userName);
    if (response && response.position) {
      const {position, userName} = response;

      switch (position) {
        case 1:
          setJugador1 ({...jugador1, id: position, username: userName});
          break;
        case 2:
          setJugador2 ({...jugador2, id: position, username: userName});
          break;
        case 3:
          setJugador3 ({...jugador3, id: position, username: userName});
          break;
        case 4:
          setJugador4 ({...jugador4, id: position, username: userName});
          break;
        case 5:
          setJugador5 ({...jugador5, id: position, username: userName});
          break;
        case 6:
          setJugador6 ({...jugador6, id: position, username: userName});
          break;
        default:
          console.log ('Número de usuario no reconocido');
      }
    }
  };

  useEffect (() => {
    socket.on ('player_list', playerList => {
      setSala (playerList);
      console.log(playerList);

      // if (Array.isArray (playerList)) {
      //   playerList.forEach (player => {
      //     const {position, userName} = player;
      //     switch (position) {
      //       case 1:
      //         setJugador1 (prevState => ({
      //           ...prevState,
      //           id: position,
      //           username: userName,
      //         }));
      //         break;
      //       case 2:
      //         setJugador2 (prevState => ({
      //           ...prevState,
      //           id: position,
      //           username: userName,
      //         }));
      //         break;
      //       case 3:
      //         setJugador3 (prevState => ({
      //           ...prevState,
      //           id: position,
      //           username: userName,
      //         }));
      //         break;
      //       case 4:
      //         setJugador4 (prevState => ({
      //           ...prevState,
      //           id: position,
      //           username: userName,
      //         }));
      //         break;
      //       case 4:
      //         setJugador5 (prevState => ({
      //           ...prevState,
      //           id: position,
      //           username: userName,
      //         }));
      //         break;
      //       case 4:
      //         setJugador6 (prevState => ({
      //           ...prevState,
      //           id: position,
      //           username: userName,
      //         }));
      //         break;
      //       default:
      //         console.log ('Número de usuario no reconocido');
      //     }
      //   });
      // }

      socket.on ('start_game', () => {
        // Aquí puedes manejar el inicio del juego
        console.log ('La partida ha comenzado!');
      });
    });
  }, []);

  useEffect (() => {
    socket.on ('position', position => {
      console.log ('Mi posición en la sala:', position);
      // Actualizar el estado con la posición del usuario
      setMyPosition (position);
    });
  }, []);

  return (
    <div className={style.contain}>
      <p>Ingresa tu id</p>
      <form onSubmit={joinRoom}>

        <input
          type="text"
          placeholder="Nombre"
          value={userName}
          onChange={e => setUserName (e.target.value)}
          maxLength={15}
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

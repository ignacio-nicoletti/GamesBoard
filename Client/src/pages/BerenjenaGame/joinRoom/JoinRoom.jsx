import {useEffect, useState} from 'react';
import style from './joinRoom.module.css';
import {
  getAllRoomsInfo,
  CreateGameRoom,
  socket,
  joinGameRoom,
} from '../../../functions/SocketIO/sockets/sockets';
import avatar from '../../../assets/berenjena/jugadores/avatar.png';
import people from '../../../assets/berenjena/jugadores/people.png';
import {Link, useNavigate} from 'react-router-dom';

const JoinRoom = ({setRoomIdberenjena, roomIdberenjena}) => {
  const [rooms, setRooms] = useState ([]); //mapeo de todas las salas
  const [game, setGame] = useState ('Berenjena'); // Juego seleccionado
  const [userName, setUserName] = useState (''); //mi nombre
  const [roomId, setRoomId] = useState (''); //id de room

  const navigate = useNavigate ();

  const CreateRoom = async e => {
    e.preventDefault ();

    try {
      if (roomId !== '' && userName !== '') {
        const response = await CreateGameRoom (game, roomId, userName);
        console.log (response);
        //poner alerta de que uniste
      }
    } catch (error) {
      console.error (error);
      alert (error); // Muestra una alerta con el mensaje de error
    }
  };

  const handlerJoinRoom = async roomId => {
    try {
      if (roomId !== '' && userName !== '') {
        const response = await joinGameRoom (game, roomId, userName);
        console.log (response);
      }
    } catch (error) {
      console.error (error);
      alert (error); // Muestra una alerta con el mensaje de error
    }
  };

  useEffect (
    () => {
      const initializeSocket = async () => {
        const roomsInfo = await getAllRoomsInfo (game);
        setRooms (roomsInfo);
      };
      initializeSocket ();
    },
    [game]
  );

  useEffect (
    () => {
      const handlePlayerList = playerList => {
        console.log (playerList);
        navigate ('/berenjena/multiplayer');
      };

      socket.on ('player_list', handlePlayerList);

      return () => {
        socket.off ('player_list', handlePlayerList);
      };
    },
    [navigate]
  );

  useEffect (
    () => {
      const handlePosition = position => {
        setRoomIdberenjena (prev => ({...prev, positionId: position}));
      };
      socket.on ('position', handlePosition);
      return () => {
        socket.off ('position', handlePosition);
      };
    },
    [setRoomIdberenjena]
  );

  return (
    <div className={style.containRoom}>
      <div className={style.sideBar}>
        <div className={style.DivButtonBack}>
          <Link to="/berenjena">
            <button> Home</button>
          </Link>
        </div>
        <div className={style.DivName}>
          <span>Name: </span>
          <input
            type="text"
            placeholder="Name"
            value={userName}
            onChange={e => setUserName (e.target.value)}
            maxLength={15}
          />
        </div>
        <div className={style.DivAvatars}>
          <p>Choose your Avatar</p>
          <div className={style.DivAvatarsGrid}>
            {[...Array (6)].map ((_, index) => (
              <img key={index} src={avatar} alt="" />
            ))}
          </div>
        </div>
        <div className={style.DivInputRoom}>
          <span>N° Room: </span>
          <input
            type="number"
            placeholder="Type number of Room "
            value={roomId}
            onChange={e => setRoomId (e.target.value)}
          />
          <button onClick={CreateRoom}>Create</button>
        </div>
      </div>

      <div className={style.DivRooms}>
        {rooms.map (el => (
          <div key={el.roomId} className={style.DivRoom}>
            <p>sala {el.roomId}</p>
            <img src={people} alt="" />
            <p>{el.users.length}/6</p>
            <button
              onClick={() => {
                handlerJoinRoom (el.roomId);
              }}
            >
              Join
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JoinRoom;

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

const JoinRoom = () => {
    const [rooms, setRooms] = useState ([]);//mapeo de todas las salas
    const [game, setGame] = useState ('Berenjena'); // Juego seleccionado
    const [userName, setUserName] = useState ('');//mi nombre
    const [roomId, setRoomId] = useState ('');//id de room
    
    const navigate = useNavigate();

    const CreateRoom = async (e) => {
        e.preventDefault();
    
        try {
          const response = await CreateGameRoom(game, roomId, userName);
          console.log(response);
        
       
        } catch (error) {
          console.error(error);
          alert(error); // Muestra una alerta con el mensaje de error
        }
      };
    
      const handlerJoinRoom = async (roomId) => {
        try {
          const response = await joinGameRoom(game, roomId, userName);
          console.log(response);
        
        } catch (error) {
          console.error(error);
          alert(error); // Muestra una alerta con el mensaje de error
        }
      };

  useEffect (
    () => {
      const initializeSocket = async () => {
        const roomsInfo = await getAllRoomsInfo (game);
        setRooms (roomsInfo);
        console.log (roomsInfo);
      };

      initializeSocket ();
    },
    [game]
  );

  useEffect (() => {
    socket.on ('player_list', playerList => {
      //   setSala (playerList);
      console.log (playerList);

      socket.on ('start_game', () => {
        // Aquí puedes manejar el inicio del juego
        console.log ('La partida ha comenzado!');
      });
    });
    return () => {
      socket.off ('player_list');
      socket.off ('start_game');
    };
  }, []);

  useEffect (() => {
    socket.on ('position', position => {
      console.log ('Mi posición en la sala:', position);
      
    });
  }, []);

  //loader para matchear room
  //al hacedr click en avatar que se ponga en seleccionado un border
  //boton de back home con icon
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

            {[...Array (6)].map ((_, index) => <img src={avatar} alt="" />)}
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
          <div className={style.DivRoom}>
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

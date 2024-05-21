import { useEffect, useState } from "react";
import style from "./joinRoom.module.css";
import {
  getAllRoomsInfo,
  CreateGameRoom,
  socket,
  joinGameRoom,
} from "../../../functions/SocketIO/sockets/sockets";
import avatar from "../../../assets/berenjena/jugadores/avatar.png";
import imgRoom from "../../../assets/berenjena/jugadores/imgRoom.png";
import logoBerenjena from "../../../assets/berenjena/home/logoBerenjena.png";
import { Link, useNavigate } from "react-router-dom";
import Autocomplete from "../../../components/autocomplete/autocomplete";

const JoinRoom = ({ setRoomIdberenjena, roomIdberenjena }) => {
  const [rooms, setRooms] = useState([]); // mapeo de todas las salas
  const [game, setGame] = useState("Berenjena"); // Juego seleccionado
  const [userName, setUserName] = useState(""); // mi nombre
  const [roomId, setRoomId] = useState(""); // id de room

  const navigate = useNavigate();

  const CreateRoom = async (e) => {
    e.preventDefault();

    try {
      if (roomId !== "" && userName !== "") {
        const response = await CreateGameRoom(game, roomId, userName);
        console.log(response);
        // poner alerta de que uniste
      }
    } catch (error) {
      console.error(error);
      alert(error); // Muestra una alerta con el mensaje de error
    }
  };

  const handlerJoinRoom = async (roomId) => {
    try {
      if (roomId !== "" && userName !== "") {
        const response = await joinGameRoom(game, roomId, userName);
        console.log(response);
      }
    } catch (error) {
      console.error(error);
      alert(error); // Muestra una alerta con el mensaje de error
    }
  };

  useEffect(() => {
    const initializeSocket = async () => {
      const roomsInfo = await getAllRoomsInfo(game);
      setRooms(roomsInfo);
    };
    initializeSocket();
  }, [game]);

  useEffect(() => {
    const handlePlayerList = (playerList) => {
      console.log(playerList);
      // Actualizar el estado global de roomIdberenjena aquí si es necesario
      navigate("/berenjena/multiplayer");
    };

    socket.on("player_list", handlePlayerList);

    return () => {
      socket.off("player_list", handlePlayerList);
    };
  }, [navigate]);

  useEffect(() => {
    const handlePosition = (position) => {
      setRoomIdberenjena((prev) => ({ ...prev, positionId: position }));
      console.log("Position:", position);
    };

    socket.on("position", handlePosition);

    return () => {
      socket.off("position", handlePosition);
    };
  }, [setRoomIdberenjena]);

  useEffect(() => {
    const handleRoomJoined = ({ roomId, position }) => {
      setRoomIdberenjena((prev) => ({ ...prev, roomId, positionId: position }));
      console.log("Room Joined:", { roomId, position });
    };

    socket.on("room_joined", handleRoomJoined);

    return () => {
      socket.off("room_joined", handleRoomJoined);
    };
  }, [setRoomIdberenjena]);

  console.log(rooms);
  return (
    <div className={style.containRoom}>
      <div className={style.sideBar}>
        <div className={style.DivButtonBack}>
          <Link to="/berenjena">Back to menu</Link>
        </div>
        <div className={style.DivName}>
          <span>Name: </span>
          <input
            type="text"
            placeholder="Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            maxLength={15}
          />
        </div>
        <div className={style.DivAvatars}>
          <p>Choose your Avatar</p>
          <div className={style.DivAvatarsGrid}>
            {[...Array(6)].map((_, index) => (
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
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button onClick={CreateRoom}>Create</button>
        </div>
      </div>

      <div className={style.DivRooms}>
        <div className={style.autocomplete}>
          <img src={logoBerenjena} alt="" className={style.logoBerenjena} />
          <Autocomplete />
          <Autocomplete />
        </div>
        <div className={style.roomsContainer}>
          {rooms.map((el) => (
            <div key={el.roomId} className={style.DivRoom}>
              <div className={style.textRoom}>
                <p>sala {el.roomId}</p>
                <p>{el.users.length}/6</p>
              </div>
              <img src={imgRoom} alt="" className={style.imgRoom}/>
              <button
                onClick={() => {
                  handlerJoinRoom(el.roomId);
                }}
              >
                Join
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JoinRoom;

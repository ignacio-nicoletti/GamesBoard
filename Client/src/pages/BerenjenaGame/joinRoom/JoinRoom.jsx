import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import style from "./joinRoom.module.css";
import {
  getAllRoomsInfo,
  CreateGameRoom,
  socket,
  joinGameRoom,
} from "../../../functions/SocketIO/sockets/sockets";

// ASSETS
import avatar1 from "../../../assets/berenjena/jugadores/avatar1.png";
import avatar2 from "../../../assets/berenjena/jugadores/avatar2.png";
import avatar3 from "../../../assets/berenjena/jugadores/avatar3.png";
import avatar4 from "../../../assets/berenjena/jugadores/avatar4.png";
import avatar5 from "../../../assets/berenjena/jugadores/avatar5.png";
import avatar6 from "../../../assets/berenjena/jugadores/avatar6.png";
import imgRoom from "../../../assets/berenjena/jugadores/imgRoom.png";
import logoBerenjena from "../../../assets/berenjena/home/logoBerenjena.png";

// MATERIAL
import Autocomplete from "../../../components/berenjena/autocomplete/autocomplete";
import GroupIcon from "@mui/icons-material/Group";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import Swal from "sweetalert2";

const JoinRoom = ({ setRoomIdberenjena, roomIdberenjena }) => {
  const [rooms, setRooms] = useState([]); // mapeo de todas las salas
  const [game, setGame] = useState("Berenjena"); // Juego seleccionado
  const [userName, setUserName] = useState(""); // mi nombre
  const [roomId, setRoomId] = useState(""); // id de room
  const [selectedAvatar, setSelectedAvatar] = useState(avatar1); // avatar seleccionado
  const [showModal, setShowModal] = useState(true); // Mostrar modal al inicio
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
  const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6];

  const handleSubmit = () => {
    if (userName && selectedAvatar) {
      setShowModal(false);
    } else {
      Swal.fire({
        title: "Error!",
        text: "Please enter your name and select an avatar to continue.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          container: "swal2-container",
        },
      });
    }
  };

  const handleEditProfile = () => {
    setShowModal(true);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className={style.containRoom}>
    {showModal && (
      <div className={style.modalOverlay}>
        <div className={style.modal}>
          <div className={style.modalContent}>
            <h2>Enter your name and choose an avatar</h2>
            <div className={style.DivName}>
              <span>Name: </span>
              <input
                type="text"
                placeholder="Type your name here..."
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                maxLength={15}
              />
            </div>
            <div className={style.DivAvatars}>
              <p>Choose your Avatar</p>
              <div className={style.DivAvatarsGrid}>
                {avatars.map((avatar, index) => (
                  <img
                    key={index}
                    src={avatar}
                    alt={`Avatar ${index + 1}`}
                    className={
                      selectedAvatar === avatar ? style.selectedAvatar : ""
                    }
                    onClick={() => setSelectedAvatar(avatar)}
                  />
                ))}
              </div>
            </div>
            <button onClick={handleSubmit}>Save</button>
          </div>
        </div>
      </div>
    )}
    {!showModal && (
      <>
        <button className={style.hamburgerButton} onClick={toggleMenu}>
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
        <div className={`${style.sideBar} ${isMenuOpen ? style.open : ""}`}>
          <div className={style.DivButtonBack}>
            <Link to="/berenjena">Back to menu</Link>
          </div>
          <p>Player:</p>
          <div className={style.profile}>
            <img
              src={selectedAvatar}
              alt="Selected Avatar"
              className={style.profileAvatar}
            />
            <span className={style.userName}>{userName}</span>
            <button className={style.editIcon} onClick={handleEditProfile}>
              <EditIcon/>
            </button>
          </div>
          <div className={style.DivInputRoom}>
            <span>Create a new room: </span>
            <input
              type="number"
              placeholder="New room number... "
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
            <button className={style.createButton} onClick={CreateRoom}>
              Create
            </button>
          </div>
        </div>

        <div className={style.DivRooms}>
          <div className={style.autocomplete}>
            <div className={style.logoContainer}>
              <img
                src={logoBerenjena}
                alt=""
                className={style.logoBerenjena}
              />
            </div>
            <div>
              <Autocomplete />
            </div>
          </div>
          <div className={style.roomsContainer}>
            {rooms.map((el) => (
              <div key={el.roomId} className={style.DivRoom}>
                <div className={style.textRoom}>
                  <p>Room {el.roomId}</p>

                  <p className={style.groupIcon}>
                    <GroupIcon />
                    {el.users.length}/6
                  </p>
                </div>
                <img src={imgRoom} alt="" className={style.imgRoom} />
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
      </>
    )}
  </div>
);
};


export default JoinRoom;

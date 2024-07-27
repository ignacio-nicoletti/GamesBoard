import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import style from "./joinRoomHorseRace.module.css";
import AutocompleteExample from "../../../components/berenjena/autocomplete/autocomplete";
import GroupIcon from "@mui/icons-material/Group";
import EditIcon from "@mui/icons-material/Edit";
import { GetDecodedCookie } from "../../../utils/DecodedCookie";
import { DecodedToken } from "../../../utils/DecodedToken";
import {
  getAllRoomsInfo,
  CreateGameRoomHorserace,
  socket,
  joinGameRoomHorserace,
} from "../../../functions/SocketIO/sockets/sockets";
import avatar1 from "../../../assets/berenjena/jugadores/avatar1.png";
import avatar2 from "../../../assets/berenjena/jugadores/avatar2.png";
import avatar3 from "../../../assets/berenjena/jugadores/avatar3.png";
import avatar4 from "../../../assets/berenjena/jugadores/avatar4.png";
import avatar5 from "../../../assets/berenjena/jugadores/avatar5.png";
import avatar6 from "../../../assets/berenjena/jugadores/avatar6.png";
import imgRoom from "../../../assets/berenjena/jugadores/imgRoom.png";
import logoBerenjena from "../../../assets/berenjena/home/logoBerenjena.png";
import InstanceOfAxios from "../../../utils/intanceAxios";
import { FadeLoader } from "react-spinners";

const JoinRoomHorseRace = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [userName, setUserName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [tempMaxUsers, setTempMaxUsers] = useState(""); // temp max o maxusers
  const [maxUsers, setMaxUsers] = useState(6);
  const [error, setError] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("avatar1");
  const [showModal, setShowModal] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();
  const [timmerRooms, setTimmerRooms] = useState(5);
  const [infoUser, setInfoUser] = useState({});
  const [game] = useState("Horserace");
  const token = GetDecodedCookie("cookieToken");

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const data = DecodedToken(token);
        const response = await InstanceOfAxios(
          `/user/${infoUser.id || data.id}`,
          "GET"
        );
        if (response && response.player) {
          setUserName(response.player.userName);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    if (token) {
      fetchPlayer();
    }
  }, []);

  const handlerCreateRoom = async (e) => {
    e.preventDefault();
    try {
      if (roomId !== "" && userName !== "") {
        const res = await CreateGameRoomHorserace(
          game,
          roomId,
          userName,
          maxUsers,
          selectedAvatar,
          infoUser
        );

        res &&
          navigate(`/horserace/multiplayer/${res.roomCreated.room.roomId}`);
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error || "An error occurred while creating the room.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          container: "swal2-container",
        },
      });
    }
  };

  const handlerJoinRoom = async (roomId) => {
    try {
      setRoomId(roomId);
      if (roomId !== "" && userName !== "") {
        const res = await joinGameRoomHorserace(
          game,
          roomId,
          userName,
          selectedAvatar,
          infoUser
        );
        res &&
          navigate(
            `/horserace/multiplayer/${res.roomJoined.roomId || res.roomId}`
          );
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error || "Room is full.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          container: "swal2-container",
        },
      });
    }
  };

  const initializeRooms = async () => {
    try {
      const roomsInfo = await getAllRoomsInfo("Horserace");
      setRooms(roomsInfo);

      setFilteredRooms(roomsInfo);
    } catch (error) {
      console.error("Error initializing rooms:", error);
      Swal.fire({
        title: "Error!",
        text: error.message || "An error occurred while fetching rooms.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          container: "swal2-container",
        },
      });
    }
  };

  // actualiza las rooms cada 5s
  useEffect(() => {
    // initializeRooms ();
    const time = setInterval(() => {
      setTimmerRooms((prevTime) => prevTime - 1);
    }, 1000);
    if (timmerRooms === 0) {
      initializeRooms();
      setTimmerRooms(5);
    }

    return () => clearInterval(time);
  }, [timmerRooms]);

  // me setea el nombre si inicio sesion
  useEffect(() => {
    if (token) {
      const data = DecodedToken(token);
      setUserName(data.userName);
      setSelectedAvatar(data.selectedAvatar || "avatar1"); // Ajuste aquí para obtener el avatar del token
      setInfoUser(data);
      if (data.userName) {
        setShowModal(false);
      }
    }
  }, []);

  useEffect(() => {
    const handleRoomCreationError = (data) => {
      Swal.fire({
        title: "Error!",
        text: data.message || "An error occurred while creating the room.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          container: "swal2-container",
        },
      });
    };
    socket.on("room_creation_error", handleRoomCreationError);

    const handleRoomJoinError = (data) => {
      Swal.fire({
        title: "Error!",
        text: data.error || "Room is full.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          container: "swal2-container",
        },
      });
    };
    socket.on("room_join_error", handleRoomJoinError);

    return () => {
      socket.off("room_creation_error", handleRoomCreationError);
      socket.off("room_join_error", handleRoomJoinError);
    };
  }, []);

  useEffect(() => {
    if (roomId && tempMaxUsers && !error) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [roomId, tempMaxUsers, error]);

  const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6];

  const handleSubmit = async () => {
    if (userName && selectedAvatar) {
      setShowModal(false);
      if (token) {
        await InstanceOfAxios(`/user/${infoUser.id}`, "PUT", {
          userName,
          selectedAvatar,
        }).then((data) => setUserName(data.player.userName));
      }
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

  const handleChange = (e) => {
    const value = e.target.value;
    if (["2", "3", "4", "5", "6"].includes(value)) {
      setTempMaxUsers(value);
      setError("");
    } else {
      setTempMaxUsers("");
      setError("Please enter a value between 2 and 6");
    }
  };

  const handleBlur = (e) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 2 || value > 6) {
      setError("Please enter a value between 2 and 6");
    } else {
      setMaxUsers(value);
      setError("");
    }
  };

  const handleFilter = (filteredRooms) => {
    setFilteredRooms(filteredRooms);
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
                        selectedAvatar === `avatar${index + 1}`
                          ? style.selectedAvatar
                          : ""
                      }
                      onClick={() => setSelectedAvatar(`avatar${index + 1}`)}
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
          <div className={style.sideBar}>
            <div className={style.DivButtonBack}>
              <Link to="/horserace">Back to menu</Link>
            </div>
            <div className={style.profile}>
              <img
                src={
                  avatars[
                    parseInt(selectedAvatar.replace("avatar", ""), 10) - 1
                  ]
                }
                alt="Selected Avatar"
                className={style.profileAvatar}
              />
              <span className={style.userName}>{userName}</span>
              <button className={style.editIcon} onClick={handleEditProfile}>
                <EditIcon />
              </button>
            </div>
            {infoUser.experience && token && (
              <div className={style.levelMap}>
                <p>Level {infoUser.experience[2].level}</p>
                <p>
                  {infoUser.experience &&
                    `xp ${infoUser.experience[2].xp}/${
                      infoUser.experience[2].xp +
                      infoUser.experience[2].xpRemainingForNextLevel
                    }`}
                </p>
              </div>
            )}

            <div className={style.DivInputRoom}>
              <span>Create a new room: </span>
              <input
                type="number"
                placeholder="room number... "
                value={roomId}
                required
                onChange={(e) => setRoomId(e.target.value)}
                className={style.inputPlaceholder}
              />
              <input
                type="text"
                placeholder="players: 2 to 6..."
                value={tempMaxUsers}
                onChange={handleChange}
                onBlur={handleBlur}
                min={2}
                max={6}
                required
                className={style.inputPlaceholder}
              />
              {error && (
                <div className={style.errorMsgContainer}>
                  <p className={style.errorMsg}>{error}</p>
                </div>
              )}
              <button
                className={style.createButton}
                onClick={handlerCreateRoom}
                disabled={!isFormValid}
              >
                Create
              </button>
              {/* <div className={style.divstoreButton}>
                <button className={style.storeButton}>Store</button>
              </div> */}
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
                <AutocompleteExample
                  roomsInfo={rooms}
                  onFilter={handleFilter}
                />
              </div>
            </div>
            <div className={style.roomsContainer}>
              {filteredRooms.length == 0 ? (
                <div className={style.loaderContainer}>
                  <FadeLoader
                    color="brown"
                    height={23}
                    width={5}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                  <p>Searching rooms...</p>
                </div>
              ) : (
                filteredRooms.map((el) => (
                  <div key={el.roomId} className={style.DivRoom}>
                    <div className={style.textRoom}>
                      <p>Room {el.roomId}</p>
                      <p className={style.groupIcon}>
                        <GroupIcon />
                        {el.users.length}/{el.maxUsers || 6}
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
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default JoinRoomHorseRace;

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

import imgRoom from "../../../assets/global/jugadores/imgRoom.png";
import logoHorserace from "../../../assets/horseGame/logohorserace.png";
import { FadeLoader } from "react-spinners";
import ChooseName from "../../../components/global/chooseName/chooseName";

const JoinRoomHorseRace = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [tempMaxUsers, setTempMaxUsers] = useState(""); // temp max o maxusers
  const [maxUsers, setMaxUsers] = useState(10);
  const [error, setError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();
  const [timmerRooms, setTimmerRooms] = useState(5);

  const [game] = useState("Horserace");
  const [showModal, setShowModal] = useState(true);
  const [userInfo, setUserInfo] = useState({
    userName: "Invitado",
    avatarProfile: {
      title: "Default Avatar",
      price: 0,
      description: "static avatar",
      levelNecesary: [{ levelB: 0, levelH: 0 }],
      url: "https://res.cloudinary.com/dbu2biawj/image/upload/v1723124993/cardgame/bwzkxvxx2jhdzibaoofc.png",
      image: true,
      category: "avatar",
    },
  });

  const handlerCreateRoom = async (e) => {
    e.preventDefault();
    try {
      if (roomId !== "" && userInfo.userName !== "") {
        const res = await CreateGameRoomHorserace(
          game,
          roomId,
          maxUsers,
          userInfo
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
      if (roomId !== "" && userInfo.userName !== "") {
        const res = await joinGameRoomHorserace(
          game,
          roomId,

          userInfo
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

  const handleChange = (e) => {
    const value = e.target.value;
    if (["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].includes(value)) {
      setTempMaxUsers(value);
      setError("");
    } else {
      setTempMaxUsers("");
      setError("Please enter a value between 1 and 10");
    }
  };

  const handleBlur = (e) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 1 || value > 10) {
      setError("Please enter a value between 1 and 10");
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
        <ChooseName
          setShowModal={setShowModal}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
        />
      )}
      {!showModal && (
        <>
          <div className={style.sideBar}>
            <div className={style.DivButtonBack}>
              <Link to="/horserace">Back to menu</Link>
            </div>
            <div className={style.profile}>
              <img
                src={userInfo.avatarProfile.url}
                alt="Selected Avatar"
                className={style.profileAvatar}
              />
              <span className={style.userName}>
                {userInfo && userInfo.userName}
              </span>
              <button
                className={style.editIcon}
                onClick={() => setShowModal(true)}
              >
                <EditIcon />
              </button>
            </div>
            {userInfo && userInfo.experience && (
              <div className={style.levelMap}>
                <p>Level {userInfo.experience[3].level}</p>
                <p>
                  {`xp ${userInfo.experience[3].xp}/${
                    userInfo.experience[3].xp +
                    userInfo.experience[3].xpRemainingForNextLevel
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
                placeholder="players: 1 to 10..."
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
              <div className={style.divstoreButton}>
                <Link to="/store" className={style.storeButtonLink}>
                  <button className={style.storeButton}>Store</button>
                </Link>
              </div>
            </div>
          </div>

          <div className={style.DivRooms}>
            <div className={style.autocomplete}>
              <div className={style.logoContainer}>
                <img
                  src={logoHorserace}
                  alt=""
                  className={style.logoHorserace}
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

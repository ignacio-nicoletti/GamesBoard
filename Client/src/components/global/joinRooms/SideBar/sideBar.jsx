import { Link, useNavigate } from "react-router-dom";
import style from "./sideBar.module.css";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import {
  CreateGameRoomHorserace,
  socket,
} from "../../../../functions/SocketIO/sockets/sockets";
import Swal from "sweetalert2";

const SideBar = ({ userInfo, setShowModal, game, setRoomId, roomId }) => {
  const [tempMaxUsers, setTempMaxUsers] = useState(""); // temp max o maxusers
  const [maxUsers, setMaxUsers] = useState(
    game === "Berenjena" ? 6 : game === "Horserace" ? 10 : ""
  );
  const [isFormValid, setIsFormValid] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    const value = e.target.value;
    if (game === "Berenjena") {
      if (["2", "3", "4", "5", "6"].includes(value)) {
        setTempMaxUsers(value);
        setError("");
      } else {
        setTempMaxUsers("");
        setError("Please enter a value between 2 and 6");
      }
    } else if (game === "Horserace") {
      if (["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].includes(value)) {
        setTempMaxUsers(value);
        setError("");
      } else {
        setTempMaxUsers("");
        setError("Please enter a value between 1 and 10");
      }
    }
  };

  const handleBlur = (e) => {
    const value = parseInt(e.target.value, 10);
    if (game === "Berenjena") {
      if (isNaN(value) || value < 2 || value > 6) {
        setError("Please enter a value between 2 and 6");
      } else {
        setMaxUsers(value);
        setError("");
      }
    } else if (game === "Horserace") {
      if (isNaN(value) || value < 1 || value > 10) {
        setError("Please enter a value between 1 and 10");
      } else {
        setMaxUsers(value);
        setError("");
      }
    }
  };

  useEffect(() => {
    if (roomId && tempMaxUsers && !error) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [roomId, tempMaxUsers, error]);

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

    return () => {
      socket.off("room_creation_error", handleRoomCreationError);
    };
  }, []);

  return (
    <div
      className={
        game === "Horserace"
          ? style.sideBarHorserace
          : game === "Berenjena"
          ? style.sideBarBerenjena
          : ""
      }
    >
      <div
        className={
          game === "Horserace"
            ? style.DivButtonBack
            : game === "Berenjena"
            ? style.DivButtonBackBerenjena
            : ""
        }
      >
        <Link
          to={
            game === "Berenjena"
              ? "/berenjena"
              : game === "Horserace"
              ? "/horserace"
              : ""
          }
        >
          Back to menu
        </Link>
      </div>
      <div className={style.profile}>
        {userInfo.avatarProfile.image ? (
          <img
            src={userInfo.avatarProfile.url}
            alt={userInfo.avatarProfile.title}
            className={style.profileAvatar}
          />
        ) : (
          <video
            src={userInfo.avatarProfile.url}
            autoPlay
            loop
            muted
            className={style.profileAvatar}
          />
        )}

        <span className={style.userName}>{userInfo && userInfo.userName}</span>
        <button
          className={
            game === "Horserace"
              ? style.editIcon
              : game === "Berenjena"
              ? style.editIconBerenjena
              : ""
          }
          onClick={() => setShowModal(true)}
        >
          <EditIcon />
        </button>
      </div>
      {userInfo && userInfo.experience && (
        <div className={style.levelMap}>
          {userInfo.experience.find(
            (gameObj) => Object.keys(gameObj)[0] === game
          ) && (
            <div>
              {userInfo.experience.map((gameObj, index) => {
                const gameName = Object.keys(gameObj)[0]; // Nombre del juego (ej: Berenjena)
                if (gameName === game) {
                  const gameData = gameObj[gameName]; // Datos del juego (nivel, xp, etc.)
                  return (
                    <div key={index} className={style.levelMap}>
                      <p>
                        Level {gameData.level} - {gameName}
                      </p>
                      <p>
                        {`xp ${gameData.xp}/${
                          gameData.xp + gameData.xpRemainingForNextLevel
                        }`}
                      </p>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          )}
        </div>
      )}
      <div
        className={
          game === "Horserace"
            ? style.DivInputRoom
            : game === "Berenjena"
            ? style.DivInputRoomBerenjena
            : ""
        }
      >
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
          placeholder={
            game === "Berenjena"
              ? "players: 2 to 6..."
              : game === "Horserace"
              ? "players: 1 to 10..."
              : ""
          }
          value={tempMaxUsers}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          className={style.inputPlaceholder}
        />
        {error && (
          <div className={style.errorMsgContainer}>
            <p className={style.errorMsg}>{error}</p>
          </div>
        )}
        <button
          className={
            game === "Horserace"
              ? style.createButton
              : game === "Berenjena"
              ? style.createButtonBerenjena
              : ""
          }
          onClick={handlerCreateRoom}
          disabled={!isFormValid}
        >
          Create
        </button>
        <div className={style.divstoreButton}>
          <Link
            to="/store"
            className={
               style.storeButtonLink
              
            }
          >
            <button className={
                 game === "Horserace"
                 ? style.storeButton
                   : game === "Berenjena"
                   ? style.storeButtonBerenjena
                   : ""
              
            }>Store</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SideBar;

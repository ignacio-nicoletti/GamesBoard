import { useEffect } from "react";
import style from "./mapRoomsComponent.module.css";
import AutocompleteExample from "../autocomplete/autocomplete";
import Swal from "sweetalert2";
import {
  joinGameRoom,
  joinGameRoomHorserace,
  socket,
} from "../../../../functions/SocketIO/sockets/sockets";
import { useNavigate } from "react-router-dom";
import GroupIcon from "@mui/icons-material/Group";
import { FadeLoader } from "react-spinners";
import imgRoom from "../../../../assets/global/jugadores/imgRoom.png";
import logoHorserace from "../../../../assets/horseGame/logohorserace.png";
import logoBerenjena from "../../../../assets/berenjena/home/logoBerenjena.png";

const MapRoomsComponent = ({
  rooms,
  game,
  userInfo,
  setFilteredRooms,
  filteredRooms,
  setRoomId,
}) => {
  const navigate = useNavigate();

  const handleFilter = (filteredRooms) => {
    setFilteredRooms(filteredRooms);
  };

  const handlerJoinRoom = async (roomId) => {
    try {
      setRoomId(roomId);
      let res;
      if (game === "Horserace") {
        res = await joinGameRoomHorserace(game, roomId, userInfo);
        res &&
          navigate(
            `/horserace/multiplayer/${res.roomJoined.roomId || res.roomId}`
          );
      } else if (game === "Berenjena") {
        res = await joinGameRoom(game, roomId, userInfo);
        if (res) {
          navigate(
            `/berenjena/multiplayer/${res.roomJoined.roomId || res.roomId}`
          );
        }
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

  useEffect(() => {
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
      socket.off("room_join_error", handleRoomJoinError);
    };
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

  return (
    <div className={style.DivRooms}>
      <div className={style.autocomplete}>
        <div className={style.logoContainer}>
          <img
            src={
              game === "Horserace"
                ? logoHorserace
                : game === "Berenjena"
                ? logoBerenjena
                : ""
            }
            alt=""
            className={style.logoHorserace}
          />
        </div>
        <div>
          <AutocompleteExample roomsInfo={rooms} onFilter={handleFilter} game={game}/>
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
            <div
              key={el.roomId}
              className={
                game === "Horserace"
                  ? style.DivRoom
                  : game === "Berenjena"
                  ? style.DivRoomBerenjena
                  : ""
              }
            >
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
  );
};

export default MapRoomsComponent;

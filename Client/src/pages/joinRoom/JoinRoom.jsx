import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import style from "./joinRoom.module.css";
import { GetDecodedCookie } from "../../utils/DecodedCookie";
import { getAllRoomsInfo } from "../../functions/SocketIO/sockets/sockets";
import SideBar from "../../components/global/joinRooms/SideBar/sideBar";
import MapRoomsComponent from "../../components/global/joinRooms/mapRoomsComponent/mapRoomsComponent";
import ChooseName from "../../components/global/joinRooms/chooseName/chooseName";
import { DecodedToken } from "../../utils/DecodedToken";
import InstanceOfAxios from "../../utils/intanceAxios";

const JoinRoom = () => {
  const [rooms, setRooms] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [timmerRooms, setTimmerRooms] = useState(5);

  const [game, setGame] = useState("");
  const [showModal, setShowModal] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const token = GetDecodedCookie("cookieToken");

  const actualUrl = window.location.pathname;

  const initializeRooms = async () => {
    try {
      const roomsInfo = await getAllRoomsInfo(game);
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
    if (actualUrl === "/joinRoom/horserace") {
      setGame("Horserace");
    } else if (actualUrl === "/joinRoom/berenjena") {
      setGame("Berenjena");
    }
    const fetchUserInfo = async () => {
      try {
        if (token) {
          setShowModal(false);
          const data = DecodedToken(token);

          const response = await InstanceOfAxios(
            `/user/${data.user.id}`,
            "GET"
          );

          setUserInfo(response.player);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);


//monta componente->depende la ruta setea el game y si hay token obtiene la data 
//trae las rooms 

  return (
    <div className={style.containRoom}>
      {showModal && userInfo.userName && (
        <ChooseName
          setShowModal={setShowModal}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
        />
      )}
      {!showModal && userInfo.userName && (
        <>
          <SideBar
            userInfo={userInfo}
            setShowModal={setShowModal}
            game={game}
            setRoomId={setRoomId}
            roomId={roomId}
          />

          <MapRoomsComponent
            rooms={rooms}
            game={game}
            userInfo={userInfo}
            setFilteredRooms={setFilteredRooms}
            filteredRooms={filteredRooms}
            setRoomId={setRoomId}
          />
        </>
      )}
    </div>
  );
};
export default JoinRoom;

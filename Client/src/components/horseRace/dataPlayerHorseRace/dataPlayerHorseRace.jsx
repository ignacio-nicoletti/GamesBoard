import React from "react";
import style from "./dataPlayerHorseRace.module.css";
import avatar1 from "../../../assets/global/jugadores/avatar1.png";
import avatar2 from "../../../assets/global/jugadores/avatar2.png";
import avatar3 from "../../../assets/global/jugadores/avatar3.png";
import avatar4 from "../../../assets/global/jugadores/avatar4.png";
import avatar5 from "../../../assets/global/jugadores/avatar5.png";
import avatar6 from "../../../assets/global/jugadores/avatar6.png";

const DataPlayerHorseRace = ({ myPlayer }) => {
  const avatarMap = {
    avatar1: avatar1,
    avatar2: avatar2,
    avatar3: avatar3,
    avatar4: avatar4,
    avatar5: avatar5,
    avatar6: avatar6,
  };

  let playerAvatar = avatarMap[myPlayer?.avatar];

  return (
    <div className={style.infoPropia}>
      <div className={style.avatar}>
        <img src={playerAvatar} alt="Avatar" />
        <span className={style.name}>
          {myPlayer?.userName ? myPlayer.userName : "Jugador"}
        </span>
      </div>
    </div>
  );
};

export default DataPlayerHorseRace;

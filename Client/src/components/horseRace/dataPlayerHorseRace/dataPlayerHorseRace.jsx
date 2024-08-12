import React from "react";
import style from "./dataPlayerHorseRace.module.css";

const DataPlayerHorseRace = ({ myPlayer }) => {
  return (
    <div className={style.infoPropia}>
      <div className={style.avatar}>
        {myPlayer && myPlayer.avatarProfile && myPlayer.avatarProfile.image ? (
          <img
            src={myPlayer.avatarProfile && myPlayer.avatarProfile.url}
            alt={myPlayer.avatar.title}
          />
        ) : (
          <video
            src={myPlayer.avatarProfile && myPlayer.avatarProfile.url}
            autoPlay
            loop
            muted
          />
        )}
        <span className={style.name}>
          {myPlayer?.userName ? myPlayer.userName : "Invitado"}
        </span>
      </div>
    </div>
  );
};

export default DataPlayerHorseRace;

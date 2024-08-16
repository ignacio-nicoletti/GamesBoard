import React from "react";
import style from "./dataPlayerHorseRace.module.css";

const DataPlayerHorseRace = ({ myPlayer }) => {
  return (
    <div className={style.infoPropia}>
      <div className={style.avatar}>
        {myPlayer && myPlayer.avatarProfile && myPlayer.avatarProfile.image ? (
          <img
            src={myPlayer.avatarProfile && myPlayer.avatarProfile.url}
            alt={myPlayer.avatarProfile.title}
          />
        ) : (
          <video
            src={myPlayer.avatarProfile && myPlayer.avatarProfile.url}
            autoPlay
            loop
            muted
          />
        )}
        <span
          className={`${style.name} ${
            myPlayer?.colorName === "Rainbow Name"
              ? style.rainbow_text
              : myPlayer?.colorName === "Red"
              ? style.red_text
              : myPlayer?.colorName === "Blue"
              ? style.blue_text
              : myPlayer?.colorName === "Green"
              ? style.green_text
              : ""
          }`}
        >
          {myPlayer?.userName ? myPlayer.userName : "Invitado"}
        </span>
      </div>
    </div>
  );
};

export default DataPlayerHorseRace;

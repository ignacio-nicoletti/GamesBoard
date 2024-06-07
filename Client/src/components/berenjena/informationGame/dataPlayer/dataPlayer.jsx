import React from "react";
import style from "./dataPlayer.module.css";
import avatar1 from "../../../../assets/berenjena/jugadores/avatar1.png";
import avatar2 from "../../../../assets/berenjena/jugadores/avatar2.png";
import avatar3 from "../../../../assets/berenjena/jugadores/avatar3.png";
import avatar4 from "../../../../assets/berenjena/jugadores/avatar4.png";
import avatar5 from "../../../../assets/berenjena/jugadores/avatar5.png";
import avatar6 from "../../../../assets/berenjena/jugadores/avatar6.png";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const DataPlayer = ({ players,myPosition,timmerPlayer,round }) => {

  const player = players[myPosition - 1];

  const avatarMap = {
    avatar1: avatar1,
    avatar2: avatar2,
    avatar3: avatar3,
    avatar4: avatar4,
    avatar5: avatar5,
    avatar6: avatar6,
  };

  let playerAvatar = avatarMap[player?.avatar];

  // Determinar si se cumplió la condición
  const isFulfilled = player?.cumplio;

  return (
    <div className={style.infoPropia}>
      <div className={style.table_component} role="region" tabIndex="0">
        <table>
          <thead>
            <tr>
              <th colSpan="2">Score</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Apostadas</td>
              <td>{player?.betP}</td>
            </tr>
            <tr>
              <td>Ganadas</td>
              <td>{player?.cardsWins}</td>
            </tr>
            <tr>
              <td>Puntos</td>
              <td>{player?.points}</td>
            </tr>
            <tr>
              <td>Ronda</td>
              <td>{round?.numRounds}</td>
            </tr>
            <tr>
              <td>Cumplió</td>

              <td
                className={isFulfilled ? style.fulfilled : style.notFulfilled}
              >
                {isFulfilled ? (
                  <>
                    Cumplió
                    {/* <CheckCircleIcon className={style.icon} /> */}
                  </>
                ) : (
                  <>
                    No Cumplió
                    {/* <CancelIcon className={style.icon} /> */}
                  </>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={style.avatar}>
        <img src={playerAvatar} alt="Avatar" />
        <span className={style.name}>
          {player?.userName ? player.userName : "Jugador"}
        </span>
        {
          round.typeRound==="ronda"&& round.turnJugadorR===myPosition?
          
          <p>tiempo para tirar :{timmerPlayer}seg</p>:""}
      </div>
    </div>
  );
};

export default DataPlayer;

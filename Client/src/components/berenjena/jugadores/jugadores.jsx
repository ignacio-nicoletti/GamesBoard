import React, { useEffect, useState, useRef } from "react";
import styles from "./jugadores.module.css";
import Cards from "../cards/card";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

import avatar1 from "../../../assets/global/jugadores/avatar1.png";
import avatar2 from "../../../assets/global/jugadores/avatar2.png";
import avatar3 from "../../../assets/global/jugadores/avatar3.png";
import avatar4 from "../../../assets/global/jugadores/avatar4.png";
import avatar5 from "../../../assets/global/jugadores/avatar5.png";
import avatar6 from "../../../assets/global/jugadores/avatar6.png";

const Jugadores = ({ player, round, timmerPlayer }) => {
  const progressRef = useRef(null);
  const [progress, setProgress] = useState(100);
  const intervalRef = useRef(null);

  const avatarMap = {
    avatar1: avatar1,
    avatar2: avatar2,
    avatar3: avatar3,
    avatar4: avatar4,
    avatar5: avatar5,
    avatar6: avatar6,
  };

  const playerAvatar = avatarMap[player?.avatar];

  const totalTime = 30;

  const getProgressColor = () => {
    const percent = progress / 100;
    const red = Math.min(255, Math.floor((1 - percent) * 255));
    const green = Math.min(255, Math.floor(percent * 255));
    return `rgb(${red},${green},0)`;
  };

  useEffect(() => {
    if (round.turnJugadorR === player.position) {
      setProgress((timmerPlayer / totalTime) * 100);

      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - 100 / totalTime;
          return newProgress >= 0 ? newProgress : 0;
        });
      }, 1000);

      return () => clearInterval(intervalRef.current);
    }
  }, [round.turnJugadorR, player.position, timmerPlayer]);

  return (
    <div
      className={
        player.connect ? styles.jugadorConectado : styles.jugadorDesconectado
      }
    >
      <div className={styles.divJugador}>
        <div className={styles.avatar}>
          <img src={playerAvatar} alt="persona" width={80} height={80} />
          <p className={styles.infoPlayer}>{player?.userName}</p>
          {round.obligado === player.position && (
            <FontAwesomeIcon
            icon={faStar}
            className={styles.obligatedIcon}
            title="Obligado"
            />
            )}
        </div>
        <div className={styles.cards}>
          {round.turnJugadorR === player.position && round.typeRound==="ronda"&&(
            <div className={styles.progressBar}>
              <div
                className={styles.progress}
                style={{
                  width: `${progress}%`,
                  backgroundColor: getProgressColor(),
                }}
                ></div>
            </div>
          )}
          <p>Bet: {player.betP} cards</p>
        </div>
        {!player.connect && (
          <div className={styles.overlay}>
            <div className={styles.disconnectedContainer}>
              <p className={styles.disconnectedText}>Player disconnected</p>
            </div>
          </div>
        )}
      </div>
      <div>
        {player?.cardBet?.value && (
          <div className={styles.cardContainer}>
            <Cards value={player?.cardBet.value} suit={player?.cardBet.suit} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Jugadores;

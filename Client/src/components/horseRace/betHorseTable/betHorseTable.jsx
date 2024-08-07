import React from "react";
import styles from "./betHorseTable.module.css"; // Asegúrate de que la ruta sea correcta

const BetHorseTable = ({ players }) => {
  return (
    <div className={styles.table}>
      <div className={styles.row}>
        <div className={styles.cell} />
        <div className={styles.cell}>Oro</div>
        <div className={styles.cell}>Copa</div>
        <div className={styles.cell}>Espada</div>
        <div className={styles.cell}>Basto</div>
        <div className={styles.cell}>Puntos</div>
      </div>
      {players &&
        players.map((player, index) => (
          <div key={index} className={styles.row}>
            <div className={styles.cell}>{player.userName}</div>
            <div className={styles.cell}>
              {player.betP && player.betP.suit === "oro"
                ? "•"
                : player.betP.suit === "-"
                ? "-"
                : ""}
            </div>
            <div className={styles.cell}>
              {player.betP && player.betP.suit === "copa"
                ? "•"
                : player.betP.suit === "-"
                ? "-"
                : ""}
            </div>
            <div className={styles.cell}>
              {player.betP && player.betP.suit === "espada"
                ? "•"
                : player.betP.suit === "-"
                ? "-"
                : ""}
            </div>
            <div className={styles.cell}>
              {player.betP && player.betP.suit === "basto"
                ? "•"
                : player.betP.suit === "-"
                ? "-"
                : ""}
            </div>
            <div className={styles.cell}>{player.points}</div>
          </div>
        ))}
    </div>
  );
};

export default BetHorseTable;

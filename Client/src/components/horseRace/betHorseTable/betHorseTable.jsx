import React from "react";
import styles from "./betHorseTable.module.css"; // Asegúrate de que la ruta sea correcta
import CancelIcon from "@mui/icons-material/Cancel";
const BetHorseTable = ({ players, setShowResult }) => {
  return (
    <>
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

      <div className={styles.tableMobileContain}>
        <div className={styles.modalCancel}>
          <CancelIcon
            className={styles.modalCancel_button}
            onClick={() => setShowResult(false)}
          />
        </div>

        <div className={styles.tableMobile}>
          <div className={styles.rowMobile}>
            <div className={styles.cellMobile} />
            <div className={styles.cellMobile}>Oro</div>
            <div className={styles.cellMobile}>Copa</div>
            <div className={styles.cellMobile}>Espada</div>
            <div className={styles.cellMobile}>Basto</div>
            <div className={styles.cellMobile}>Puntos</div>
          </div>
          {players &&
            players.map((player, index) => (
              <div key={index} className={styles.rowMobile}>
                <div className={styles.cellMobile}>{player.userName}</div>
                <div className={styles.cellMobile}>
                  {player.betP && player.betP.suit === "oro"
                    ? "•"
                    : player.betP.suit === "-"
                    ? "-"
                    : ""}
                </div>
                <div className={styles.cellMobile}>
                  {player.betP && player.betP.suit === "copa"
                    ? "•"
                    : player.betP.suit === "-"
                    ? "-"
                    : ""}
                </div>
                <div className={styles.cellMobile}>
                  {player.betP && player.betP.suit === "espada"
                    ? "•"
                    : player.betP.suit === "-"
                    ? "-"
                    : ""}
                </div>
                <div className={styles.cellMobile}>
                  {player.betP && player.betP.suit === "basto"
                    ? "•"
                    : player.betP.suit === "-"
                    ? "-"
                    : ""}
                </div>
                <div className={styles.cellMobile}>{player.points}</div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default BetHorseTable;

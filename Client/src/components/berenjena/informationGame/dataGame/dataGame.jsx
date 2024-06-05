import React from "react";
import style from "./dataGame.module.css";

const DataGame = ({ round }) => {
  return (
    <div className={style.infoPartida}>
      <p>
        Obligado: <span className={style.dataValue}>{round?.obligado}</span>
      </p>
      <p>
        Apuesta Total:{" "}
        <span className={style.dataValue}>{round?.betTotal}</span>
      </p>
      <p>
        Carta Ganadora:{" "}
        <span className={style.dataValue}>
          {round?.cardWinxRound?.value} {round?.cardWinxRound?.suit}
        </span>
      </p>
      <p>
        Mano: <span className={style.dataValue}>{round?.hands}</span>
      </p>
      <p>
        Turno:{" "}
        <span className={style.dataValue}>
          {round?.typeRound === "Bet"
            ? round?.turnJugadorA
            : round?.turnJugadorR}
        </span>
      </p>
    </div>
  );
};

export default DataGame;

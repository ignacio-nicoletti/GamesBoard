import React from "react";
import style from "./dataGame.module.css";

const DataGame = ({ round }) => {
  return (
    <div className={style.infoPartida}>
     
      <p>
        Total Bet:{" "}
        <span className={style.dataValue}>{round?.betTotal}</span>
      </p>
      <p>
        Card Win : {" "}
        <span className={style.dataValue}>
          {round?.cardWinxRound?.value} {round?.cardWinxRound?.suit}
        </span>
      </p>
    
      {/* <p>
        Turn: Player{" "}
        <span className={style.dataValue}>
          {round?.typeRound === "Bet"
            ? round?.turnJugadorA
            : round?.turnJugadorR}
        </span>
      </p> */}
      {/* <p>{round.typeRound}</p> */}
       {/* <p>
        Obligado: <span className={style.dataValue}>{round?.obligado}</span>
      </p> 
         <p>
        Mano: <span className={style.dataValue}>{round?.hands}</span>
      </p> */}
    </div>
  );
};

export default DataGame;

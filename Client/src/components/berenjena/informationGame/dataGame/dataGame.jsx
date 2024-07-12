import React from 'react';
import style from './dataGame.module.css';

const DataGame = ({round, players}) => {
  const getPlayerName = playerId => {
    const player = players.filter (player => player.position === playerId);
    return player.length > 0 ? player[0].userName : '-';
  };
  return (
    <div className={style.infoPartida}>

      <p>
        Total Bet: {' '}
        <span className={style.dataValue}>{round.betTotal}</span>
      </p>
      <p>
        Turn: {' '}
        {round.typeRopund === 'ronda'
          ? <span className={style.dataValue}>
              {getPlayerName (round.turnJugadorR)}
            </span>
          : <span className={style.dataValue}>
              {getPlayerName (round.turnJugadorA)}
            </span>}
      </p>
      <p>
        Card Win : {' '}
        <span className={style.dataValue}>
          {round.cardWinxRound && round.cardWinxRound.value}
          {' '}
          {round.cardWinxRound && round.cardWinxRound.suit}
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

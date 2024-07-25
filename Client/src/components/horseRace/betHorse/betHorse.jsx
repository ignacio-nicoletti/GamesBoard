import { useEffect, useState } from 'react';
import Cards from '../cards/cards';
import style from './betHorse.module.css';
import { socket } from '../../../functions/SocketIO/sockets/sockets';

const BetHorse = ({ setPlayers, round, setRound, myPosition, setResults, dataRoom }) => {
  const [card, setCard] = useState({ value: "11", suit: "" });

  const handleCardClick = (suit) => {
    setCard({ ...card, suit });
  };

  const handleSubmit = () => {
    // socket.emit('BetPlayer_horserace', {
    //   bet: card,
    //   myPosition,
    //   dataRoom,
    // });
    console.log(card);
  };

  useEffect(() => {
    const handleGameStateUpdate = (data) => {
      setRound(data.round);
      setPlayers(data.players);
      setResults(data.results);
    };

    socket.on('update_game_state', handleGameStateUpdate);

    return () => {
      socket.off('update_game_state', handleGameStateUpdate);
    };
  }, [round, setRound, setPlayers, setResults]);

  return (
    <div className={style.contain}>
      <p>Choose your horse to win!!</p>
      <div className={style.containCards}>
        <div className={style.divCard} onClick={() => handleCardClick("oro")}>
          <Cards value={"11"} suit={"oro"} />
        </div>
        <div className={style.divCard} onClick={() => handleCardClick("espada")}>
          <Cards value={"11"} suit={"espada"} />
        </div>
        <div className={style.divCard} onClick={() => handleCardClick("basto")}>
          <Cards value={"11"} suit={"basto"} />
        </div>
        <div className={style.divCard} onClick={() => handleCardClick("copa")}>
          <Cards value={"11"} suit={"copa"} />
        </div>
      </div>
      <div>
        <button onClick={handleSubmit}>Bet</button>
      </div>
    </div>
  );
};

export default BetHorse;

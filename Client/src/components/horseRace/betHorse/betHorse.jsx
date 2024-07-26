import { useEffect, useState } from "react";
import Cards from "../cards/cards";
import style from "./betHorse.module.css";
import { socket } from "../../../functions/SocketIO/sockets/sockets";

const BetHorse = ({
  setPlayers,
  round,
  setRound,
  myPosition,
  setResults,
  dataRoom,
}) => {
  const [card, setCard] = useState({ value: "11", suit: "" });
  const [hasBet, setHasBet] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds timer

  function getRandomCard() {
    const suits = ["oro", "espada", "basto", "copa"];
    const value = "11";
    const randomSuit = suits[Math.floor(Math.random() * suits.length)];
    return { value, suit: randomSuit };
  }


  const handleCardClick = (suit) => {
    setCard({ ...card, suit });
  };

  const handleSubmit = () => {
    socket.emit("BetPlayer_horserace", {
      bet: card,
      myPosition,
      dataRoom,
    });
    setHasBet(true); // Mark that the player has bet
  };

  useEffect(() => {
    const handleGameStateUpdate = (data) => {
      setRound(data.round);
      setPlayers(data.players);
      setResults(data.results);
    };

    socket.on("update_game_state", handleGameStateUpdate);

    const handleBetReceived = () => {
      setHasBet(true); // Update the state when the bet is received
    };

    socket.on("bet_received", handleBetReceived);

    return () => {
      socket.off("update_game_state", handleGameStateUpdate);
      socket.off("bet_received", handleBetReceived);
    };
  }, [round, setRound, setPlayers, setResults]);

  useEffect(() => {
    if (!hasBet && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    }

    if (timeLeft === 0 && !hasBet) {
      socket.emit("BetPlayer_horserace", {
        bet: getRandomCard(),
        myPosition,
        dataRoom,
      });
   
      setHasBet(true); // Mark that the player has bet
    }
  }, [timeLeft, hasBet, myPosition, dataRoom]);

  return (
    <div className={style.contain}>
      {!hasBet && round.typeRound === "Bet" ? (
        <div>
          <p>Choose your horse to win!!</p>
          <p>Time left: {timeLeft} seconds</p>
          <div className={style.containCards}>
            <div
              className={`${style.divCard} ${
                card.suit === "oro" ? style.selectedCard : ""
              }`}
              onClick={() => handleCardClick("oro")}
            >
              <Cards value={"11"} suit={"oro"} />
            </div>
            <div
              className={`${style.divCard} ${
                card.suit === "espada" ? style.selectedCard : ""
              }`}
              onClick={() => handleCardClick("espada")}
            >
              <Cards value={"11"} suit={"espada"} />
            </div>
            <div
              className={`${style.divCard} ${
                card.suit === "basto" ? style.selectedCard : ""
              }`}
              onClick={() => handleCardClick("basto")}
            >
              <Cards value={"11"} suit={"basto"} />
            </div>
            <div
              className={`${style.divCard} ${
                card.suit === "copa" ? style.selectedCard : ""
              }`}
              onClick={() => handleCardClick("copa")}
            >
              <Cards value={"11"} suit={"copa"} />
            </div>
          </div>
          <div className={style.buttonDiv}>
            <button onClick={handleSubmit}>Bet</button>
          </div>
        </div>
      ) : (
        <div>
          <p>Waiting for other players to bet...</p>
        </div>
      )}
    </div>
  );
};

export default BetHorse;

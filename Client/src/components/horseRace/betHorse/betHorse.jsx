import { useEffect, useState } from "react";
import Cards from "../cards/cardsHorse";
import style from "./betHorse.module.css";
import {
  distributeHorserace,
  socket,
} from "../../../functions/SocketIO/sockets/sockets";

const BetHorse = ({ setPlayers, round, setRound, myPlayer, dataRoom }) => {
  const [card, setCard] = useState({ value: "11", suit: "-" });//card selecionada
  const [hasBet, setHasBet] = useState(false); // ya vote
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds timer
  const [inBet, setInBet] = useState(false); //si entro en la apuesta o no

  const handleCardClick = (suit) => {
    setCard({ ...card, suit });
    setInBet(true);
  };

  const handleCheckboxChange = () => {
    if (inBet) {
      setCard({ ...card, suit: "-" });
    }
    setInBet(false);
  };

  const handleSubmit = () => {
    socket.emit("BetPlayer_horserace", {
      inBet: inBet,
      bet: card,
      myPlayer,
      dataRoom,
    });
    setHasBet(true); // Mark that the player has bet
  };

  useEffect(() => {
    const handleGameStateUpdate = (data) => {
      setRound(data.round);
      setPlayers(data.players);
    };

    socket.on("update_game_state_horserace", handleGameStateUpdate);

    const handleBetReceived = () => {
      setHasBet(true); // Update the state when the bet is received
    };

    socket.on("bet_received", handleBetReceived);

    return () => {
      socket.off("update_game_state_horserace", handleGameStateUpdate);
      socket.off("bet_received", handleBetReceived);
    };
  }, [round, setRound, setPlayers]);

  useEffect(() => {
    if (!hasBet && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    }

    if (timeLeft === 0 && !hasBet) {
      socket.emit("BetPlayer_horserace", {
        inBet: inBet,
        bet: { value: "11", suit: "-" },
        myPlayer,
        dataRoom,
      });
      setHasBet(true); // Mark that the player has bet
    }
  }, [timeLeft, hasBet, dataRoom]);

  return (
    <div className={style.contain}>
      {!hasBet && round.typeRound === "Bet" ? (
        <div>
          <p>Choose your horse to win!!</p>
          <p>Time left: {timeLeft} seconds</p>

          <div className={style.checkbox_wrapper_24}>
            <p>In Bet</p>
            <input
              type="checkbox"
              id="check_24"
              name="check"
              checked={inBet}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="check_24">
              <span></span>
            </label>
          </div>

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

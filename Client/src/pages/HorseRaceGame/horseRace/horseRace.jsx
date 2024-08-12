import { useEffect, useState } from "react";
import styles from "./horseRace.module.css";
import DataPlayerHorseRace from "../../../components/horseRace/dataPlayerHorseRace/dataPlayerHorseRace";
import {
  distributeHorserace,
  socket,
} from "../../../functions/SocketIO/sockets/sockets";
import BetHorse from "../../../components/horseRace/betHorse/betHorse";
import TimmerComponentHorserace from "../../../components/horseRace/timmerComponentHorserace/timmerComponentHorserace";
import BetHorseTable from "../../../components/horseRace/betHorseTable/betHorseTable";
import HorseContain from "../../../components/horseRace/horseContain/horseContain";
import HorseSideLeft from "../../../components/horseRace/horseSideLeft/horseSideLeft";
import DeckRight from "../../../components/horseRace/deckRight/deckRight";
import WinnerComponentHorserace from "../../../components/horseRace/winnerComponentHorserace/winnerComponentHorserace";
import ButtonExitRoom from "../../../components/global/buttonExitRoom/buttonExitRoom";

const HorseRace = () => {
  const [showResult, setShowResult] = useState(false);
  const [myPlayer, setMyPlayer] = useState({});

  const [players, setPlayers] = useState([]);
  const [round, setRound] = useState({});
  const [dataRoom, setDataRoom] = useState({});

  const [winner, setWinner] = useState({});

  useEffect(() => {
    socket.on("Finish_game_horserace", (data) => {
      setRound(data.round);
      setWinner(data.winners);
    });
    return () => {
      socket.off("Finish_game_horserace");
    };
  }, []);

  const updatePlayerList = (data) => {
    if (data) {
      setMyPlayer(data.user);
      setPlayers(data.users);
      setRound(data.round);
    }
  };

  useEffect(() => {
    socket.on("room_created_myInfo_horserace", updatePlayerList);
    socket.on("room_joined_myInfo_horserace", updatePlayerList);

    socket.on("player_list_horserace", (data) => {
      setPlayers(data.users);
      setRound(data.round);
      setDataRoom(data.room);
    });

    if (
      round &&
      round.typeRound === "ronda" &&
      round.sideLeftCards.suit === ""
    ) {
      //si es ronda y no hay cartas dadas...mezcla
      distributeHorserace(dataRoom, setRound);
    }
    return () => {
      socket.off("player_list_horserace", updatePlayerList);
      socket.off("start_game_horserace");
    };
  }, [round, players]);

  return (
    <div className={styles.contain}>
      <div className={styles.contain}>
        <DataPlayerHorseRace myPlayer={myPlayer} />
        <ButtonExitRoom game={dataRoom.game} />
        {dataRoom && dataRoom.gameStarted && round.typeRound === "Bet" && (
          <BetHorse
            setPlayers={setPlayers}
            round={round}
            setRound={setRound}
            myPlayer={myPlayer}
            dataRoom={dataRoom}
          />
        )}
        {dataRoom && dataRoom.gameStarted && round.typeRound === "waiting" && (
          <TimmerComponentHorserace dataRoom={dataRoom} setRound={setRound} />
        )}

        {dataRoom &&
          dataRoom.gameStarted &&
          round.typeRound === "FinishGame" && (
            <WinnerComponentHorserace
              dataRoom={dataRoom}
              setRound={setRound}
              winner={winner}
              players={players}
            />
          )}
        <HorseContain round={round} />
        <HorseSideLeft round={round} />
        <DeckRight round={round} dataRoom={dataRoom} setRound={setRound} />
        <BetHorseTable players={players} />
      </div>
    </div>
  );
};

export default HorseRace;
// hacer que el distribute sea post apostar carta

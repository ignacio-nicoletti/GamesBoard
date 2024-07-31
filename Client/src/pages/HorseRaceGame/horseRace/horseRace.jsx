import { useEffect, useState } from "react";
import styles from "./horseRace.module.css";
import LoaderHorseRace from "../../../components/horseRace/loaderHorseRace/loaderHorseRace";
import Cards from "../../../components/horseRace/cards/cardsHorse";
import DataPlayerHorseRace from "../../../components/horseRace/dataPlayerHorseRace/dataPlayerHorseRace";
import ButtonExitRoomHorserace from "../../../components/horseRace/buttonExitRoomHorserace/buttonExitRoomHorserace";
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

const HorseRace = () => {
  const [loader, setLoader] = useState(false); //active loaderComponente
  const [showResult, setShowResult] = useState(false); //showResult in mobile
  const [myPlayer, setMyPlayer] = useState({}); //information player
  const [players, setPlayers] = useState([]);
  const [round, setRound] = useState({});
  const [dataRoom, setDataRoom] = useState({});
  const [winner, setWinner] = useState({}); // base del resultado xronda
  const [timerCard, setTimerCard] = useState(3);
console.log(round.typeRound);
  useEffect(() => {
    if (dataRoom && !dataRoom.gameStarted) {
      setLoader(true);
    }
    const handleStartGame = (data) => {
      if (data) {
        setRound(data.round); //establece typeRound en waiting
        setDataRoom(data.room);
        setPlayers(data.users);
        setLoader(false);
      }
    };
    distributeHorserace(dataRoom, setRound);
    socket.on("start_game_horserace", handleStartGame);

    return () => {
      socket.off("start_game_horserace", handleStartGame);
    };
  }, [dataRoom]);

  // useEffect(() => {
  //   if (round.typeRound === "ronda") {
  //     socket.emit("tirarCarta_horserace", dataRoom);
  //   }
  //   socket.on("cardTirada_horserace", (data) => {
  //     setRound(data.round);
  //   });
  //   return () => {
  //     socket.off("cardTirada_horserace");
  //   };
  // }, [round]);

  return (
    <div className={styles.contain}>
      {loader ? (
        <LoaderHorseRace
          setPlayers={setPlayers}
          setRound={setRound}
          myPlayer={myPlayer}
          setMyPlayer={setMyPlayer}
          setLoader={setLoader}
          setDataRoom={setDataRoom}
          dataRoom={dataRoom}
        />
      ) : (
        <div className={styles.contain}>
          <DataPlayerHorseRace
            myPosition={myPlayer.position}
            players={players}
          />
          <ButtonExitRoomHorserace />

          {dataRoom && dataRoom.gameStarted && round.typeRound === "Bet" && (
            <BetHorse
              setPlayers={setPlayers}
              round={round}
              setRound={setRound}
              myPosition={myPlayer.position}
              dataRoom={dataRoom}
            />
          )}

          {dataRoom &&
            dataRoom.gameStarted &&
            round.typeRound === "waiting" && (
              <TimmerComponentHorserace setRound={setRound} round={round} />
            )}

          <HorseContain round={round} />

          <HorseSideLeft round={round} />

          <DeckRight round={round} />

          <BetHorseTable players={players} />
        </div>
      )}
    </div>
  );
};

export default HorseRace;

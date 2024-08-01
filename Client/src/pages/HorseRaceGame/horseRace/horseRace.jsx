import { useEffect, useState, useCallback } from "react";
import styles from "./horseRace.module.css";
import LoaderHorseRace from "../../../components/horseRace/loaderHorseRace/loaderHorseRace";
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
  const [loader, setLoader] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [myPlayer, setMyPlayer] = useState({});
  const [players, setPlayers] = useState([]);
  const [round, setRound] = useState({});
  const [dataRoom, setDataRoom] = useState({});
  const [winner, setWinner] = useState({});


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
      distributeHorserace(dataRoom, setRound);
    };
    socket.on("start_game_horserace", handleStartGame);

    return () => {
      socket.off("start_game_horserace", handleStartGame);
    };
  }, [dataRoom]);



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
          <p>{round.typeRound}</p>
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
              <TimmerComponentHorserace round={round} setRound={setRound} />
            )}

          <HorseContain round={round} />
          <HorseSideLeft round={round} />
          <DeckRight round={round} dataRoom={dataRoom}  setRound={setRound}/>
          <BetHorseTable players={players} />
        </div>
      )}
    </div>
  );
};

export default HorseRace;

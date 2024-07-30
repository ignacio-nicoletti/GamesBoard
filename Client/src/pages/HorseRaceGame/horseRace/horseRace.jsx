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
  const [results, setResults] = useState([]); // base del resultado xronda
  const [winner, setWinner] = useState({}); // base del resultado xronda
  const [timerCard, setTimerCard] = useState(3);


  useEffect(() => {
    if (dataRoom && !dataRoom.gameStarted) {
      setLoader(true);
    }
    const handleStartGame = (data) => {
      setRound(data.round); //establece typeRound en waiting
      setResults(data.results);
      setDataRoom(data.room);
      setPlayers(data.users);

      setLoader(false);
    };
    socket.on("start_game_horserace", handleStartGame);

    return () => {
      socket.off("start_game_horserace", handleStartGame);
    };
  }, [dataRoom]);
  //Start-game

  useEffect(() => {
    if (round && round.typeRound === "ronda") {
      distributeHorserace(dataRoom, setRound);
    }
  }, [round.typeRound]);

  useEffect(() => {
    const handleRoomRefresh = (data) => {
      setRound(data.round);
      setPlayers(data.users);
      setResults(data.results);
    };
    socket.on("roomRefresh_horserace", handleRoomRefresh);
    return () => {
      socket.off("roomRefresh_horserace", handleRoomRefresh);
    };
  }, []);


   useEffect(() => {
    const timer = setInterval(() => {
      setTimerCard((prevTime) => {
        if (prevTime > 0) {
          console.log(timerCard);
          return prevTime - 1;
        } else if (prevTime === 0) {
          if (round && round.typeRound === "ronda") {
            socket.emit("tirarCarta_horserace", dataRoom);
          }
          return 3; // Reset the timer
        }
        return prevTime;
      });
    }, 1000);

    return () => clearInterval(timer); // Clean up the interval on component unmount
  }, [timerCard]);

  useEffect(() => {
    const handleTirarCarta = (data) => {
      setRound(data.round);
    };

    // socket.on("tirarCarta_horserace", handleTirarCarta);

    return () => {
      // socket.off("tirarCarta_horserace", handleTirarCarta); // Clean up the socket listener on component unmount
    };
  }, []);
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
              setResults={setResults}
              dataRoom={dataRoom}
            />
          )}

          {dataRoom &&
            dataRoom.gameStarted &&
            (round.typeRound === "waiting" ||
              round.typeRound === "waitingPlayers") && (
              <TimmerComponentHorserace
                setRound={setRound}
                round={round}
                players={players}
                results={results}
                dataRoom={dataRoom}
              />
            )}

          <HorseContain round={round} setRound={setRound} dataRoom={dataRoom} />

          <HorseSideLeft cardsMap={round.sideLeftCards} />

          <DeckRight round={round} />

          <BetHorseTable players={players} />
        </div>
      )}
    </div>
  );
};

export default HorseRace;

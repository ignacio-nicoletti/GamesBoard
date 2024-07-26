import { useEffect, useState } from "react";
import styles from "./horseRace.module.css";
import LoaderHorseRace from "../../../components/horseRace/loader/loaderHorseRace";
import Cards from "../../../components/horseRace/cards/cards";
import DataPlayerHorseRace from "../../../components/horseRace/dataPlayerHorseRace/dataPlayerHorseRace";
import ButtonExitRoomHorserace from "../../../components/horseRace/buttonExitRoomHorserace/buttonExitRoomHorserace";
import { socket } from "../../../functions/SocketIO/sockets/sockets";
import BetHorse from "../../../components/horseRace/betHorse/betHorse";
import TimmerComponentHorserace from "../../../components/horseRace/timmerComponentHorserace/timmerComponentHorserace";
import BetHorseTable from "../../../components/horseRace/betHorseTable/betHorseTable";

const HorseRace = () => {
  const [loader, setLoader] = useState(false); //active loaderComponente
  const [showResult, setShowResult] = useState(false); //showResult in mobile
  const [myPlayer, setMyPlayer] = useState({}); //information player

  const [players, setPlayers] = useState([]);
  const [round, setRound] = useState({});
  const [dataRoom, setDataRoom] = useState({});
  const [results, setResults] = useState([]); // base del resultado xronda
  const [winner, setWinner] = useState({}); // base del resultado xronda

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

    // socket.on ('GameFinish', data => {
    //   setRound (data.round);
    //   setPlayers (data.players);
    //   setResults (data.results);
    //   setWinner (data.winner);
    // });
    return () => {
      socket.off("start_game_horserace", handleStartGame);
    };
  }, [dataRoom]);
  //Start-game

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

          <div className={styles.cardsContain}>
            <div className={styles.cards}>
              <Cards value={"11"} suit={"oro"} />
            </div>
            <div className={styles.cards}>
              <Cards value={"11"} suit={"espada"} className={styles.cards} />
            </div>
            <div className={styles.cards}>
              <Cards value={"11"} suit={"basto"} className={styles.cards} />
            </div>
            <div className={styles.cards}>
              <Cards value={"11"} suit={"copa"} className={styles.cards} />
            </div>
          </div>

          <div className={styles.cardsContainSideLeft}>
            <div className={styles.cardsSideLeft}>
              <Cards value={"8"} suit={"oro"} />
            </div>
            <div className={styles.cardsSideLeft}>
              <Cards value={"3"} suit={"copa"} />
            </div>
            <div className={styles.cardsSideLeft}>
              <Cards value={"10"} suit={"basto"} />
            </div>
            <div className={styles.cardsSideLeft}>
              <Cards value={"12"} suit={"basto"} />
            </div>
            <div className={styles.cardsSideLeft}>
              <Cards value={"4"} suit={"espada"} />
            </div>
          </div>

          <div className={styles.cardsContainMazo}>
            <Cards value={"1"} suit={"oro"} />
          </div>

          <BetHorseTable players={players} />
        </div>
      )}
    </div>
  );
};

export default HorseRace;

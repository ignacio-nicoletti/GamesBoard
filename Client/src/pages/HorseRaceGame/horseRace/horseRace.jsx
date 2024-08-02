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
import WinnerComponentHorserace from "../../../components/horseRace/winnerComponentHorserace/winnerComponentHorserace";
import { useParams } from "react-router-dom";

const HorseRace = () => {
  const [loader, setLoader] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [myPlayer, setMyPlayer] = useState({});

  const [players, setPlayers] = useState([]);
  const [round, setRound] = useState({});
  const [dataRoom, setDataRoom] = useState({});

  const [winner, setWinner] = useState({});
  const { id } = useParams();

  useEffect(() => {
    if (dataRoom && !dataRoom.gameStarted) {
      // setLoader(true);
    }
  }, [dataRoom]);

  useEffect(() => {
    const UpdateData = (data) => {
      if (data) {
        setRound(data.round); //establece typeRound en waiting
        setDataRoom(data.room);
        setPlayers(data.users);
      }
    };
    socket.on("start_game_horserace", UpdateData);
    socket.on("Finish_game_horserace", (data) => {
      setRound(data.round);
      setWinner(data.winners);
    });

    socket.on("reset_completed_horserace", (data) => setRound(data.round));
    return () => {
      socket.off("start_game_horserace");
      socket.off("Finish_game_horserace");
    };
  }, []);

  const updatePlayerList = (data) => {
    console.log(data);
    if (data && data.users) {
      setMyPlayer(data.myInfo);
      setPlayers(data.users);
      setRound(data.round);
      setDataRoom(data.room);

      // const myUpdatedInfo = data.users.find(
      //   (player) => player.idSocket === socket.id
      // );

      // if (myUpdatedInfo) {
      //   setMyPlayer({
      //     ...myPlayer,
      //     position: myUpdatedInfo.position,
      //     userName: myUpdatedInfo.userName,
      //   });
      // }
    }
  };

  useEffect(() => {
    socket.on("room_created_horserace", (data) => {
      setMyPlayer(data.myInfo);
      setPlayers(data.users);
      setRound(data.round);
      setDataRoom(data.room);
    });
    socket.on("room_joined_horserace", updatePlayerList);
    socket.on("player_list_horserace", updatePlayerList);

    return () => {
      socket.off("room_created_horserace", updatePlayerList);
      socket.off("room_joined_horserace", updatePlayerList);
      socket.off("roomRefresh_horserace", updatePlayerList);
      socket.off("player_list_horserace", updatePlayerList);
    };
  }, [round]);

  useEffect(() => {
    socket.emit("roomRefresh_horserace", { dataRoom });
    return () => {
      socket.off("roomRefresh_horserace", updatePlayerList);
    };
  }, [round]);

  
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
              <TimmerComponentHorserace
                round={round}
                setRound={setRound}
                dataRoom={dataRoom}
              />
            )}

          {dataRoom &&
            dataRoom.gameStarted &&
            round.typeRound === "FinishGame" && (
              <WinnerComponentHorserace
                round={round}
                setRound={setRound}
                winner={winner}
              />
            )}
          <HorseContain round={round} />
          <HorseSideLeft round={round} />
          <DeckRight round={round} dataRoom={dataRoom} setRound={setRound} />
          <BetHorseTable players={players} />
        </div>
      )}
    </div>
  );
};

export default HorseRace;
// hacer que el distribute sea post apostar carta

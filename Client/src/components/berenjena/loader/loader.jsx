import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../../../functions/SocketIO/sockets/sockets";
import PersonIcon from "@mui/icons-material/Person";
import ButtonExitRoom from "../buttonExitRoom/buttonExitRoom";
import style from "./loader.module.css";

const Loader = ({ game, setMyPosition, players, setPlayers }) => {
  const [readyMe, setReadyMe] = useState(false);
  const [playerList, setPlayerList] = useState([]);
  const { id } = useParams();

  const handleReady = () => {
    setReadyMe(true);
    socket.emit("player_ready", { game, roomId: id });
  };

  useEffect(() => {
    const updatePlayerList = (data) => {
      setPlayerList(data);
      const currentPlayer = data.find(
        (player) => player.idSocket === socket.id
      );
      if (currentPlayer) {
        setMyPosition(currentPlayer.position);
      }
      setPlayers(data);
    };

    const updatePlayerReadyStatus = (playerReadyStatus) => {
      setPlayerList((prevList) =>
        prevList.map((player) =>
          player.id === playerReadyStatus.id
            ? { ...player, ready: playerReadyStatus.ready }
            : player
        )
      );
    };

    socket.on("player_list", updatePlayerList);
    socket.on("player_ready_status", updatePlayerReadyStatus);

    return () => {
      socket.off("player_list", updatePlayerList);
      socket.off("player_ready_status", updatePlayerReadyStatus);
    };
  }, [setMyPosition, setPlayers]);

  return (
    <div className={style.containLoader}>
      <ul className={style.background}>
        {Array.from({ length: 30 }).map((_, index) => (
          <li key={index}></li>
        ))}
      </ul>
      <div className={style.loader}></div>
      <p className={style.preGameMessage}>
        Esperando que todos los jugadores estén listos para comenzar.
      </p>
      <div className={style.playersAndButton}>
        <div className={style.PlayersReady}>
          {playerList.map((player) => (
            <PersonIcon
              key={player.id}
              sx={{ fontSize: 50 }}
              alt="Current Player"
              className={`${style.playerImage} ${
                player.ready ? style.ready : ""
              }`}
            />
          ))}
          {!playerList.some((player) => player.idSocket === socket.id) && (
            <PersonIcon
              sx={{ fontSize: 50 }}
              alt="Current Player"
              className={`${style.playerImage} ${readyMe ? style.ready : ""}`}
            />
          )}
        </div>
        <button
          className={style.readyBtn}
          onClick={handleReady}
          disabled={readyMe}
        >
          Ready
        </button>
      </div>
      <ButtonExitRoom />
    </div>
  );
};

export default Loader;

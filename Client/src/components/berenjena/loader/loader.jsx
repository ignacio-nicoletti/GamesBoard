import style from './loader.module.css';
import ButtonExitRoom from '../buttonExitRoom/buttonExitRoom';
import { useEffect, useState } from 'react';
import { socket } from '../../../functions/SocketIO/sockets/sockets';
import { useParams } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';

const Loader = ({ game, setMyPosition, players, setPlayers }) => {
  const [readyMe, setReadyMe] = useState(false);
  const [playerList, setPlayerList] = useState([]);
  const { id } = useParams();

  const handleReady = () => {
    setReadyMe(true);

    socket.emit('player_ready', {
      game,
      roomId: id,
    });
  };

  useEffect(() => {
    const updatePlayerList = (data) => {
      console.log(data);
      setPlayerList(data);
      const currentPlayer = data.find(player => player.idSocket === socket.id);
      if (currentPlayer) {
        setMyPosition(currentPlayer.position);
      }
      setPlayers(data);
    };

    const updatePlayerReadyStatus = (playerReadyStatus) => {
      console.log(playerReadyStatus);
      setPlayerList(prevList =>
        prevList.map(player =>
          player.id === playerReadyStatus.id
            ? { ...player, ready: playerReadyStatus.ready }
            : player
        )
      );
    };

    socket.on('player_list', updatePlayerList);
    socket.on('player_ready_status', updatePlayerReadyStatus);

    return () => {
      socket.off('player_list', updatePlayerList);
      socket.off('player_ready_status', updatePlayerReadyStatus);
    };
  }, [setMyPosition, setPlayers]);

  return (
    <div className={style.containLoader}>
      <div className={style.loader}>Loading...</div>
      <div className={style.playersAndButton}>
        <div className={style.PlayersReady}>
          {playerList.map((player, index) => (
            <img
              key={index}
              src={player.avatar} // Aquí se asume que cada jugador tiene una propiedad avatar con la URL de su imagen
              alt={`Player ${index + 1}`}
              className={style.playerImage}
              style={{ borderColor: player.ready ? '#ff904f' : '#dededf' }}
            />
          ))}
          {!playerList.some(player => player.idSocket === socket.id) && (
            <PersonIcon
              sx={{ fontSize: 50 }}
              alt="Current Player"
              className={style.playerImage}
              style={{ borderColor: readyMe ? '#ff904f' : '#dededf' }}
            />
          )}
        </div>
        <div>
          <button
            className={style.readyBtn}
            onClick={handleReady}
            disabled={readyMe}
          >
            Ready
          </button>
        </div>
      </div>
      <ButtonExitRoom />
    </div>
  );
};

export default Loader;

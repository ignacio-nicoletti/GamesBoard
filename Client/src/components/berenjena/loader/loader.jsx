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
    socket.on('player_list', data => {
      setPlayerList(data);

      const currentPlayer = data.find(player => player.id === socket.id);
      if (currentPlayer) {
        setMyPosition(currentPlayer);
      }

      // Update the players state with the received data
      setPlayers(prevPlayers =>
        prevPlayers.map(player => {
          const updatedPlayer = data.find(p => p.position === player.id);
          return updatedPlayer ? { ...player, userName: updatedPlayer.userName,avatar:updatedPlayer.selectedAvatar } : player;
        })
      );
    });

    return () => {
      socket.off('player_list');
    };
  }, [setMyPosition, setPlayers]);

  useEffect(() => {
    // Escuchar el evento cuando se une un nuevo jugador
    socket.on('room_joined', data => {
      setMyPosition(data);
      setPlayers(prevPlayers =>
        prevPlayers.map(player =>
          player.id === data.position ? { ...player, userName: data.userName,avatar:data.selectedAvatar
          } : player
        )
      );
    });

    // Escuchar el evento cuando un jugador está listo
    socket.on('player_ready_status', playerReadyStatus => {
      setPlayerList(prevList =>
        prevList.map(
          player =>
            player.id === playerReadyStatus.id
              ? { ...player, ready: playerReadyStatus.ready }
              : player
        )
      );
    });

    return () => {
      socket.off('room_joined');
      socket.off('player_ready_status');
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
              src={player.imageUrl} // Aquí se asume que cada jugador tiene una propiedad imageUrl con la URL de su imagen
              alt={`Player ${index + 1}`}
              className={style.playerImage}
              style={{ borderColor: player.ready ? '#ff904f' : '#dededf' }}
            />
          ))}
          {/* Agregar una imagen adicional si el usuario actual no está en la lista de jugadores */}
          {!playerList.some(player => player.id === socket.id) &&
            <PersonIcon
              sx={{ fontSize: 50 }}
              alt="Current Player"
              className={style.playerImage}
              style={{ borderColor: readyMe ? '#ff904f' : '#dededf' }}
            />}
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

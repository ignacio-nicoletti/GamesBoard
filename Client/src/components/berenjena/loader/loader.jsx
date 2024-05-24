import style from './loader.module.css';
import ButtonExitRoom from '../buttonExitRoom/buttonExitRoom';
import { useEffect, useState } from 'react';
import { socket } from '../../../functions/SocketIO/sockets/sockets';
import { useParams } from 'react-router-dom';

const Loader = ({ game }) => {
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
    });

    return () => {
      socket.off('player_list');
    };
  }, []);

  useEffect(() => {
    // Escuchar el evento cuando se une un nuevo jugador
    socket.on('player_joined', (newPlayer) => {
      setPlayerList((prevList) => [...prevList, newPlayer]);
    });

    // Escuchar el evento cuando un jugador está listo
    socket.on('player_ready_status', (playerReadyStatus) => {
      setPlayerList((prevList) =>
        prevList.map(player =>
          player.id === playerReadyStatus.id ? { ...player, ready: playerReadyStatus.ready } : player
        )
      );
    });

    return () => {
      socket.off('player_joined');
      socket.off('player_ready_status');
    };
  }, []);

  return (
    <div className={style.containLoader}>
      <div className={style.loader}>
        Loading...
      </div>
      <div className={style.playersAndButton}>
        <div className={style.PlayersReady}>
          {playerList.map((player, index) => (
            <svg
              key={index}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke={player.ready ? '#ff904f' : '#dededf'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-circle-dashed-check"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M8.56 3.69a9 9 0 0 0 -2.92 1.95" />
              <path d="M3.69 8.56a9 9 0 0 0 -.69 3.44" />
              <path d="M3.69 15.44a9 9 0 0 0 1.95 2.92" />
              <path d="M8.56 20.31a9 9 0 0 0 3.44 .69" />
              <path d="M15.44 20.31a9 9 0 0 0 2.92 -1.95" />
              <path d="M20.31 15.44a9 9 0 0 0 .69 -3.44" />
              <path d="M20.31 8.56a9 9 0 0 0 -1.95 -2.92" />
              <path d="M15.44 3.69a9 9 0 0 0 -3.44 -.69" />
              <path d="M9 12l2 2l4 -4" />
            </svg>
          ))}
          {/* Agregar un SVG adicional si el usuario actual no está en la lista de jugadores */}
          {!playerList.some(player => player.id === socket.id) &&
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke={readyMe ? '#ff904f' : '#dededf'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-circle-dashed-check"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M8.56 3.69a9 9 0 0 0 -2.92 1.95" />
              <path d="M3.69 8.56a9 9 0 0 0 -.69 3.44" />
              <path d="M3.69 15.44a9 9 0 0 0 1.95 2.92" />
              <path d="M8.56 20.31a9 9 0 0 0 3.44 .69" />
              <path d="M15.44 20.31a9 9 0 0 0 2.92 -1.95" />
              <path d="M20.31 15.44a9 9 0 0 0 .69 -3.44" />
              <path d="M20.31 8.56a9 9 0 0 0 -1.95 -2.92" />
              <path d="M15.44 3.69a9 9 0 0 0 -3.44 -.69" />
              <path d="M9 12l2 2l4 -4" />
            </svg>}
        </div>
        <div>
          <button onClick={handleReady} disabled={readyMe}>Ready</button>
        </div>
      </div>
      <ButtonExitRoom />
    </div>
  );
};

export default Loader;

import style from './loader.module.css';
import ButtonExitRoom from "../buttonExitRoom/buttonExitRoom"
import { useEffect, useState } from 'react';
import { socket } from '../../../functions/SocketIO/sockets/sockets';

const Loader = ({ game, roomIdberenjena}) => {
  const [readyMe, setReadyMe] = useState(false);
  const [playerList, setPlayerList] = useState([]);

  const handleReady = () => {
    setReadyMe(true);
    socket.emit('player_ready', { game, roomId: roomIdberenjena.roomId });
  };

  useEffect(() => {
    socket.on('player_list', data => {
      setPlayerList(data);
    });

    return () => {
      socket.off('player_list');
    };
  }, []);

  const readyCount = playerList.filter(player => player.ready).length;
  return (
    <div className={style.containLoader}>
      <div className={style.loader}>
        Loading...
      </div>
      <div className={style.playersAndButton}>
        <div className={style.PlayersReady}>
          {[...Array(6)].map((_, index) => (
            <svg
              key={index}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke={index < readyCount ? '#ff904f' : '#dededf'}
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
        </div>
        <button onClick={handleReady} disabled={readyMe}>Ready</button>
      </div>
      <ButtonExitRoom />
    </div>
  );
};

export default Loader;

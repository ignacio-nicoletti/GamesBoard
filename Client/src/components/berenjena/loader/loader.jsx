import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {socket} from '../../../functions/SocketIO/sockets/sockets';
import PersonIcon from '@mui/icons-material/Person';
import CheckIcon from '@mui/icons-material/Check';
import ButtonExitRoom from '../buttonExitRoom/buttonExitRoom';
import style from './loader.module.css';

const Loader = ({game, setMyPosition, setPlayers, setRound}) => {
  const [readyMe, setReadyMe] = useState (false);
  const [playerList, setPlayerList] = useState ([]);
  const {id} = useParams ();

  const handleReady = () => {
    setReadyMe (true);
    socket.emit ('player_ready', {game, roomId: id});
  };

  useEffect (
    () => {
      const updatePlayerList = data => {
        setPlayerList (data.users);
        setPlayers (data.users);
        setRound (data.round);
        const currentPlayer = data.users.find (
          player => player.idSocket === socket.id
        );
        if (currentPlayer) {
          setMyPosition (currentPlayer.position);
        }
      };

      const updatePlayerReadyStatus = playerReadyStatus => {
        setPlayerList (prevList =>
          prevList.map (
            player =>
              player.idSocket === playerReadyStatus.idSocket
                ? {...player, ready: playerReadyStatus.ready}
                : player
          )
        );
      };

      socket.on ('player_list', updatePlayerList);
      socket.on ('player_ready_status', updatePlayerReadyStatus);

      return () => {
        socket.off ('player_list', updatePlayerList);
        socket.off ('player_ready_status', updatePlayerReadyStatus);
      };
    },
    [setMyPosition, setPlayers, readyMe, playerList]
  );

  return (
    <div className={style.containLoader}>
      <h1 className={style.roomTitle}>Te estás uniendo a la sala N°{id}</h1>
      <ul className={style.background}>
        {Array.from ({length: 30}).map ((_, index) => <li key={index} />)}
      </ul>
      <div className={style.loader} />
      <p className={style.preGameMessage}>
        Esperando que todos los jugadores estén listos para comenzar.
      </p>
      <div className={style.playersAndButton}>
        <div className={style.PlayersReady}>
          {playerList.map (
            player =>
              player.ready
                ? <CheckIcon
                    key={player.idSocket}
                    sx={{fontSize: 50, color: '#ff904f'}}
                    alt="Current Player"
                    className={`${style.playerImage} ${style.ready}`}
                  />
                : <PersonIcon
                    key={player.idSocket}
                    sx={{fontSize: 50}}
                    alt="Current Player"
                    className={style.playerImage}
                  />
          )}
          {!playerList.some (player => player.idSocket === socket.id) &&
            (readyMe
              ? <CheckIcon
                  sx={{fontSize: 50, color: '#ff904f'}}
                  alt="Current Player"
                  className={`${style.playerImage} ${style.ready}`}
                />
              : <PersonIcon
                  sx={{fontSize: 50}}
                  alt="Current Player"
                  className={style.playerImage}
                />)}
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

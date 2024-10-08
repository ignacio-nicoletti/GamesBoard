import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {socket} from '../../../functions/SocketIO/sockets/sockets';
import PersonIcon from '@mui/icons-material/Person';
import CheckIcon from '@mui/icons-material/Check';

import style from './loader.module.css';
import ButtonExitRoom from '../../global/buttonExitRoom/buttonExitRoom';

const Loader = ({setPlayers, setRound, myPlayer, setMyPlayer,setLoader,setDataRoom,dataRoom}) => {
  const [readyMe, setReadyMe] = useState (false);
  const [playerList, setPlayerList] = useState ([]);
  const {id} = useParams ();
  const handleReady = () => {
    setReadyMe (true);
    socket.emit ('player_ready', dataRoom);
  };

  const updatePlayerList = data => {
    if (data && data.users) {
      setPlayerList (data.users);
      setPlayers (data.users);
      setRound (data.round);
      setDataRoom(data.room)
      const myUpdatedInfo = data.users.find (
        player => player.idSocket === socket.id
      );
      if (myUpdatedInfo) {
        setMyPlayer ({...myPlayer,position:myUpdatedInfo.position,userName:myUpdatedInfo.userName});
      }
      if(data&&data?.room?.gameStarted===true){
        setLoader(false)
      }
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

  useEffect (
    () => {
  
      socket.on ('room_created', updatePlayerList);
      socket.on ('room_joined', updatePlayerList);

      socket.emit ('roomRefresh', dataRoom={game:"Berenjena",roomId:id});
      socket.on ('roomRefresh', updatePlayerList);

      socket.on ('player_list', updatePlayerList);
      socket.on ('player_ready_status', updatePlayerReadyStatus);

      return () => {
        socket.off ('room_created', updatePlayerList);
        socket.off ('room_joined', updatePlayerList);
        socket.off ('roomRefresh', updatePlayerList);
        socket.off ('player_list', updatePlayerList);
        socket.off ('player_ready_status', updatePlayerReadyStatus);
      };
    },
    [setPlayerList]
  );

  useEffect (
    () => {
      socket.emit ('roomRefresh',{dataRoom});
      socket.on ('roomRefresh', updatePlayerList);
      return () => {
        socket.off ('roomRefresh', updatePlayerList);
      };
    },
    [ playerList,setMyPlayer, setPlayers, setRound,dataRoom]
  );

  return (
    <div className={style.containLoader}>
      <h1 className={style.roomTitle}>You are joining room N°{id}</h1>
      <ul className={style.background}>
        {Array.from ({length: 30}).map ((_, index) => <li key={index} />)}
      </ul>
      <div className={style.loader} />
      <p className={style.preGameMessage}>
      Waiting for all players to be ready to start.
      </p>
      <p>{myPlayer.position}</p>
      <div className={style.playersAndButton}>
        <div className={style.PlayersReady}>
          {playerList.length > 0 &&
            playerList.map (
              player =>
                player.ready
                  ? <CheckIcon
                      key={player.idSocket}
                      sx={{fontSize: 60, color: '#ff904f'}}
                      alt="Current Player"
                      className={`${style.playerImage} ${style.ready}`}
                    />
                  : <PersonIcon
                      key={player.idSocket}
                      sx={{fontSize: 60}}
                      alt="Current Player"
                      className={style.playerImage}
                    />
            )}
          {!playerList.some (player => player.idSocket === socket.id) &&
            (readyMe
              ? <CheckIcon
                  sx={{fontSize: 60, color: '#ff904f'}}
                  alt="Current Player"
                  className={`${style.playerImage} ${style.ready}`}
                />
              : <PersonIcon
                  sx={{fontSize: 60}}
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
      <ButtonExitRoom game={dataRoom.game} />
    </div>
  );
};

export default Loader;

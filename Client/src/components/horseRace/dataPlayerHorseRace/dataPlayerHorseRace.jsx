import React, {useEffect, useRef, useState} from 'react';
import style from './dataPlayerHorseRace.module.css';
import avatar1 from '../../../assets/berenjena/jugadores/avatar1.png';
import avatar2 from '../../../assets/berenjena/jugadores/avatar2.png';
import avatar3 from '../../../assets/berenjena/jugadores/avatar3.png';
import avatar4 from '../../../assets/berenjena/jugadores/avatar4.png';
import avatar5 from '../../../assets/berenjena/jugadores/avatar5.png';
import avatar6 from '../../../assets/berenjena/jugadores/avatar6.png';
import {faStar} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const DataPlayerHorseRace = ({players, myPosition}) => {
  const [player, setPlayer] = useState ({});

 
  useEffect (
    () => {
      const playerPos = players[myPosition - 1];
      if (playerPos) {
        setPlayer (playerPos);
      }
    },
    [players, myPosition]
  );

  
  const avatarMap = {
    avatar1: avatar1,
    avatar2: avatar2,
    avatar3: avatar3,
    avatar4: avatar4,
    avatar5: avatar5,
    avatar6: avatar6,
  };

  // let playerAvatar = avatarMap[player.avatar];
  let playerAvatar = avatarMap["avatar5"];;
  // Determinar si se cumplió la condición
  const isFulfilled = player.cumplio;

  return (
    <div className={style.infoPropia}>
      
      <div className={style.avatar}>
        <img src={playerAvatar} alt="Avatar" />
        <span className={style.name}>
          {player.userName ? player.userName : 'Jugador'}
        </span>
        

      </div>
    </div>
  );
};

export default DataPlayerHorseRace;

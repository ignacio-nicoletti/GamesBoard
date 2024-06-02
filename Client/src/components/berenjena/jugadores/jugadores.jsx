import React from 'react';
import styles from './jugadores.module.css';
import cardsIcon from '../../../assets/berenjena/jugadores/cartas.png';
import Cards from '../cards/card';

import avatar1 from "../../../assets/berenjena/jugadores/avatar1.png";
import avatar2 from "../../../assets/berenjena/jugadores/avatar2.png";
import avatar3 from "../../../assets/berenjena/jugadores/avatar3.png";
import avatar4 from "../../../assets/berenjena/jugadores/avatar4.png";
import avatar5 from "../../../assets/berenjena/jugadores/avatar5.png";
import avatar6 from "../../../assets/berenjena/jugadores/avatar6.png";

const Jugadores = ({player}) => {
  const avatarMap = {
    avatar1: avatar1,
    avatar2: avatar2,
    avatar3: avatar3,
    avatar4: avatar4,
    avatar5: avatar5,
    avatar6: avatar6,
  }

  let playerAvatar = avatarMap[player?.avatar] // Seleccionar el avatar correcto


  return (
    <div className={""}>
      <div className={styles.divJugador}>

        <div className={styles.avatar}>
          <img src={playerAvatar} alt="persona" width={80} height={80} />
          <p style={{margin: 0}}>{player?.userName}</p>
        </div>
        <div className={styles.cards}>
          <img src={cardsIcon} alt="" />
        </div>
      </div>

      <div>

        <div className={""}>
          {player.cardBet.value &&
           
              <div className={""}>
                <Cards
                
                  value={player.cardBet.value}
                  suit={player.cardBet.suit}
                
                />
              </div>
            }
        </div>

      </div>

    </div>
  );
};

export default Jugadores;

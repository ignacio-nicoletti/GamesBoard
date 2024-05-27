import style from './dataPlayer.module.css';
import avatar from '../../../../assets/berenjena/jugadores/avatar1.png';

const DataPlayer = ({jugador}) => {
  return (
    <div className={style.infoPropia}>

      <div className={style.table_component} role="region" tabIndex="0">
        <table>

          <thead>

            <tr>Tablero</tr>

          </thead>
          <tbody>
            <tr>
              <td>Apostadas</td>
              <td>{jugador.betP}</td>

            </tr>
            <tr>
              <td>Ganadas</td>
              <td>{jugador.cardswins}</td>

            </tr>
          </tbody>
        </table>

      </div>
      <div className={style.avatar}>
        <img src={avatar} alt="" />
        <span className={style.name}>
          {jugador.userName ? jugador.userName : 'Jugador'}
        </span>
      </div>
    </div>
  );
};
export default DataPlayer;

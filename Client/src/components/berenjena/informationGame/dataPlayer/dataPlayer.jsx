import style from './dataPlayer.module.css';
import avatar from '../../../../assets/berenjena/jugadores/avatar1.png';

const DataPlayer = ({jugador}) => {
  console.log(jugador);
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
              <td>0</td>

            </tr>
            <tr>
              <td>Ganadas</td>
              <td>0</td>

            </tr>
          </tbody>
        </table>

      </div>
      <div className={style.avatar}>
        <img src={avatar} alt="" />
        <span className={style.name}>
          {jugador.username ? jugador.username : 'Jugador'}
        </span>
      </div>
    </div>
  );
};
export default DataPlayer;

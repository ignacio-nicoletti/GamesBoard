import style from './dataPlayer.module.css';
import avatar from '../../../../assets/berenjena/jugadores/avatar.png';

const DataPlayer = ({jugador}) => {
  return (
    <div className={style.infoPropia}>

      <div>
        <table className={style.table}>
          <td>
            Tablero
            <tr>
              <td>
                Apostadas
              </td>
              <td>{jugador.apuestaP}</td>
            </tr>

            <tr>
              <td>
                Ganadas
              </td>
              <td>{jugador.cardsganadas}</td>
            </tr>

          </td>
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

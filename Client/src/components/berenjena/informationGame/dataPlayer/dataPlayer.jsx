import style from './dataPlayer.module.css';
import person from '../../../../assets/jugadores/person2.png';

const DataPlayer = ({jugador, myPosition}) => {
  return (
    <div className={style.infoPropia}>
      {/* 
      <p>Jugador: {myPosition}</p>*/}
      {/* <p>Cumplio: {jugador.cumplio === true ? '✔' : '❌'}</p> */}
      <div>
        <div className={style.avatar}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="orange"
            stroke-width="1"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="icon icon-tabler icons-tabler-outline icon-tabler-user-circle"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
            <path d="M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
            <path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855" />
          </svg>
        </div>
        <p className={style.name}>{jugador.username}</p>
        <p className={style.apuesta}>
          Ganadas: {jugador.cardsganadas} /
          {' '}
          {jugador.apuestaP == null ? '0' : jugador.apuestaP}
          {' '}
          carta/s
          {' '}
        </p>
      </div>

    </div>
  );
};
export default DataPlayer;

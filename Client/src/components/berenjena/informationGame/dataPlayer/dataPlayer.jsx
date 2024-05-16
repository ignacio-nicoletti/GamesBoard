import style from './dataPlayer.module.css';

const DataPlayer = ({jugador, myPosition}) => {
  return (
    <div className={style.infoPropia}>

      <p>Jugador: {myPosition}</p>
      <p>Nombre: {jugador.username}</p>
      <p>
        Apuesta propia:
        {' '}
        {jugador.apuestaP === -1 ? '-' : jugador.apuestaP}
        {' '}
        carta/s
        {' '}
      </p>
      <p>Ganadas: {jugador.cardsganadas}</p>
      <p>Cumplio: {jugador.cumplio === true ? '✔' : '❌'}</p>
    </div>
  );
};
export default DataPlayer;

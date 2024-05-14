import style from './dataPlayer.module.css';

const DataPlayer = ({jugador1}) => {
  return (
    <div className={style.infoPropia}>
      <p>Nombre: {jugador1.username}</p>
      <p>
        Apuesta propia:
        {' '}
        {jugador1.apuestaP === -1 ? '-' : jugador1.apuestaP}
        {' '}
        carta/s
        {' '}
      </p>
      <p>Ganadas: {jugador1.cardsganadas}</p>
      <p>Cumplio: {jugador1.cumplio === true ? '✔' : '❌'}</p>
    </div>
  );
};
export default DataPlayer;

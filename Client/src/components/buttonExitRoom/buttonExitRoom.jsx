import {Link} from 'react-router-dom';
import style from './buttonExitRoom.module.css';
import {disconnectRoom} from '../../functions/SocketIO/sockets/sockets';
const ButtonExitRoom = () => {
  const handlerExitRoom = () => {
    disconnectRoom ();
  };

  return (
    <div>
      <Link to="/berenjena" className={style.link}>
        <div className={style.backHome} onClick={handlerExitRoom}>
          <div className={style.LogoBack}>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className={style.link}
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
              <path d="M9 12h12l-3 -3" />
              <path d="M18 15l3 -3" />
            </svg>
          </div>
          <div className={style.parrafo}>
            <p className={style.link}>Exit Room</p>
          </div>
        </div>
      </Link>

    </div>
  );
};
export default ButtonExitRoom;

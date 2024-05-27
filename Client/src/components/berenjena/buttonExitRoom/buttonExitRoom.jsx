import { Link } from "react-router-dom";
import style from "./buttonExitRoom.module.css";
import { disconnectRoom } from "../../../functions/SocketIO/sockets/sockets";

const ButtonExitRoom = () => {
  const handlerExitRoom = () => {
    disconnectRoom();
  };

  return (
    <div className={style.container}>
      <Link
        to="/berenjena"
        onClick={handlerExitRoom}
        className={style.ButtonExitRoom}
      >
        <p className={style.link}>Exit Room</p>
      </Link>
    </div>
  );
};

export default ButtonExitRoom;

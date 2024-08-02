import { useEffect, useState } from "react";
import styles from "./winnerComponentHorserace.module.css";
import { socket } from "../../../functions/SocketIO/sockets/sockets";

const WinnerComponentHorserace = ({ dataRoom, winner }) => {
  const [timmer, settimmer] = useState(3);

  useEffect(() => {
    const time = setInterval(() => {
      settimmer((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          socket.emit("reset_horserace", dataRoom);
        }
        return prevTime;
      });
    }, 1000);

    return () => clearInterval(time);
  }, [timmer]);

  console.log(winner);
  return (
    <div className={styles.container}>
      <div>
        <h3 className={styles.message}>
          Finish race: <span className={styles.timer}>{timmer}</span>
        </h3>
        winners:
        {/* {winner.map((el) => (
            <p>{el.userName}</p>
          ))} */}
      </div>
    </div>
  );
};

export default WinnerComponentHorserace;

import { useEffect, useState } from "react";
import styles from "./timmerComponentHorserace.module.css";
import { distributeHorserace } from "../../../functions/SocketIO/sockets/sockets";

const TimmerComponentHorserace = ({setRound, dataRoom }) => {
  const [timmer, settimmer] = useState(3);

  useEffect(() => {
    const time = setInterval(() => {
      settimmer((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else if (prevTime === 0) {
          distributeHorserace(dataRoom, setRound);//type: ronda 
          return prevTime;
        }
      });
    }, 1000);

    return () => clearInterval(time);
  }, [timmer]);

  return (
    <div className={styles.container}>
      <div>
        <h3 className={styles.message}>
          Starting the race: <span className={styles.timer}>{timmer}</span>
        </h3>
      </div>
    </div>
  );
};

export default TimmerComponentHorserace;

import { useEffect, useState } from "react";
import styles from "./timmerComponentHorserace.module.css";

const TimmerComponentHorserace = ({ setRound, round }) => {
  const [timmer, settimmer] = useState(0);

  useEffect(() => {
    if (!round) return;

    let initialTime = 5;

    settimmer(initialTime);

    const time = setInterval(() => {
      settimmer((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          clearInterval(time);

          setRound({ ...round, typeRound: "ronda" });

          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(time);
  }, []);

  return (
    <div className={styles.container}>
      <div>
        <h3 className={styles.message}>
          Starting the race : <span className={styles.timer}>{timmer}</span>
        </h3>
      </div>
    </div>
  );
};

export default TimmerComponentHorserace;

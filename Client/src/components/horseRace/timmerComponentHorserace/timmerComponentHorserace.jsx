import { useEffect, useState } from "react";
import styles from "./timmerComponentHorserace.module.css";

const TimmerComponentHorserace = ({ round, setRound }) => {
  const [timer, setTimer] = useState(5);

  useEffect(() => {
    const time = setInterval(() => {
      setTimer((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          clearInterval(time);
          setRound({ ...round, typeRound: "ronda" });
          return 5; // Reiniciar el temporizador
        }
      });
    }, 1000);

    return () => clearInterval(time); // Limpiar el intervalo en desmontaje
  }, []);

  return (
    <div className={styles.container}>
      <div>
        <h3 className={styles.message}>
          Starting the race: <span className={styles.timer}>{timer}</span>
        </h3>
      </div>
    </div>
  );
};

export default TimmerComponentHorserace;

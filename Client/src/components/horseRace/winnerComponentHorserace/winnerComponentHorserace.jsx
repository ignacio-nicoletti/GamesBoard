import { useEffect, useState } from "react";
import styles from "./winnerComponentHorserace.module.css";
import { socket } from "../../../functions/SocketIO/sockets/sockets";
import InstanceOfAxios from "../../../utils/intanceAxios";

const WinnerComponentHorserace = ({ dataRoom, setRound, winner }) => {
  const [timmer, settimmer] = useState(5);


  const AddExperience = async () => {
    // await InstanceOfAxios (`/user/addexperience/`, 'PUT', {
    //   winner,
    //   dataRoom,
   
    // });
  };



  useEffect(() => {
    const time = setInterval(() => {
      settimmer((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          socket.emit("reset_horserace", dataRoom);
          socket.on("reset_completed_horserace", (data) => {
            setRound(data.round);
          });
          AddExperience()
          return 3; // Reset the timer to 3
        }
      });
    }, 1000);

    return () => clearInterval(time);
  }, []);

  return (
    <div className={styles.container}>
      <h1>Finish race</h1>
      <div className={styles.divWinners}>
        <div className={styles.titleWinners}>
          <p>winners:</p>
        </div>
        <div>
          {winner.map((el) => (
            <p key={el.userName}>- {el.userName}</p>
          ))}
        </div>
      </div>
      <div className={styles.divtimmer}>
        <p>Starting new race in ... {timmer}</p>
      </div>

      <div className={styles.divFirework}>

      <div className={styles.firework}></div>
      <div className={styles.firework}></div>
      <div className={styles.firework}></div>
      </div>
    </div>
  );
};

export default WinnerComponentHorserace;

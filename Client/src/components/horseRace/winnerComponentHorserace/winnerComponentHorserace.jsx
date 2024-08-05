import { useEffect, useState } from "react";
import styles from "./winnerComponentHorserace.module.css";
import { socket } from "../../../functions/SocketIO/sockets/sockets";

const WinnerComponentHorserace = ({ dataRoom, setRound, winner }) => {
  const [timmer, settimmer] = useState(3);

winner=[{userName:"pepe"},{userName:"pepe"}]


  useEffect(() => {
    const time = setInterval(() => {
      settimmer((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          // socket.emit("reset_horserace", dataRoom);
          socket.on("reset_completed_horserace", (data) => {
            setRound(data.round);
          });
          return 3; // Reset the timer to 3
        }
      });
    }, 1000);

    return () => clearInterval(time);
  }, []);

  return (
    <div className={styles.container}>
      <h1>Finish race</h1>
      <div>

      winners:
      {winner.map((el) => (
        <p key={el.userName}>{el.userName}</p>
        ))}
        </div>
    </div>
  );
};

export default WinnerComponentHorserace;

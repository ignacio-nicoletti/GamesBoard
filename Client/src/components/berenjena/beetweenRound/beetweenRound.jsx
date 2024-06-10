import styles from "./beetweenRound.module.css";

const BeetweenRound = ({ timmerBetweenRound }) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.message}>
        Cambio de ronda en:{" "}
        <span className={styles.timer}>{timmerBetweenRound}</span>
      </h3>
    </div>
  );
};

export default BeetweenRound;

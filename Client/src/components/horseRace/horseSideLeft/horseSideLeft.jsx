import Cards from "../cards/cards";
import styles from "./horseSideLeft.module.css";

const HorseSideLeft = () => {

  return (
    <div className={styles.ContainSideLeft}>
      <div className={styles.cardsContainSideLeft}>
        
      <div className={`${styles.cardsSideLeft} ${styles.yPos1}`}>
        <Cards value={"8"} suit={"oro"} />
      </div>
      <div className={`${styles.cardsSideLeft} ${styles.yPos2}`}>
        <Cards value={"3"} suit={"copa"} />
      </div>
      <div className={`${styles.cardsSideLeft} ${styles.yPos3}`}>
        <Cards value={"10"} suit={"basto"} />
      </div>
      <div className={`${styles.cardsSideLeft} ${styles.yPos4}`}>
        <Cards value={"12"} suit={"basto"} />
      </div>
      <div className={`${styles.cardsSideLeft} ${styles.yPos5}`}>
        <Cards value={"4"} suit={"espada"} />
      </div>
      </div>
    </div>
  );
};

export default HorseSideLeft;

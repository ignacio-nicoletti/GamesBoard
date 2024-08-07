import Cards from "../cards/cardsHorse";
import styles from "./horseSideLeft.module.css";

const HorseSideLeft = ({ round }) => {
  const yPositions = [
    styles.yPos1,
    styles.yPos2,
    styles.yPos3,
    styles.yPos4,
    styles.yPos5,
  ];

  return (
    <div className={styles.ContainSideLeft}>
      {round && round.sideLeftCards&&
        round.sideLeftCards.slice(0, 5).map((card, index) => (
          <div
            key={index}
            className={`${styles.cardsSideLeft} ${yPositions[index]}`}
          >
            <Cards value={card.value} suit={card.suit} back={card.back} />
          </div>
        ))}
    </div>
  );
};

export default HorseSideLeft;

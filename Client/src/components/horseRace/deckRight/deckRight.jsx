import Cards from "../cards/cardsHorse";
import styles from "./deckRight.module.css";

const DeckRight = ({ round }) => {
  return (
    <div className={styles.cardsContainMazo}>
      {round.cardSuit && (
        <Cards
          value={round.cardSuit.value}
          suit={round.cardSuit.suit}
          back={!round.cardSuit.value}
        />
      )}
    </div>
  );
};

export default DeckRight;

import { Link } from "react-router-dom";
import style from "./rulesBerenjena.module.css";

const RulesOfBerenjena = () => {
  return (
    <div className={style.contain}>
      <div className={style.info}>
        <div className={style.rulesTitle}>
          <h3>Game Rules</h3>
        </div>

        <p>
          The game consists of betting a certain number of cards according to
          the number of deals and fulfilling that bet.
        </p>
        <p style={{ textDecoration: "underline" }}>How do I win?</p>
        <p>
          The game starts with 1 card dealt and the player to the right of the{" "}
          <span>Obligated</span> starts.
        </p>
        <p>
          The value of the cards, from highest to lowest, is: 1, 12, 11... 3, 2.
        </p>
        <p>
          If your opponent to the left plays a card (e.g., a 5), you must play a
          6 or higher as the higher card wins the hand.
        </p>

        <p>Whoever wins the round starts the next one.</p>
        <p>
          <span>Obligated: </span>
          This is the person who is forced to break the tie between the number
          of bets and the number of cards dealt. (For example, if 3 cards are
          dealt and the sum of each player's bet is 3, the obligated player is
          "obligated" to bet 1 or more cards. Another case is if 3 cards are
          dealt and the sum of the bets is 2, then the obligated player cannot
          say 1 as it would equal the results, so they must say zero or two).
        </p>
        <p>
          Bets are made in turns starting from the right of the obligated player
          in a counterclockwise direction, meaning the "obligated" player is the
          last to bet.
        </p>
        <p>
          When scoring, whoever fulfills their bet, i.e., wins the cards they
          bet, will score 5 points + the number of cards they won. (If they
          fulfilled their bet but bet 0 cards, they would only score 5 points).
        </p>
        <div className={style.linkBackMenu}>
          <Link to="/berenjena" className={style.link}>
            Back to Menu
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RulesOfBerenjena;

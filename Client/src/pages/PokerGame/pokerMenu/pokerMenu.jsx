import { Link } from "react-router-dom";
import styles from "./pokerMenu.module.css";
import pokerTitle from "../../../assets/poker/pokerTitle.png";

const PagePrimaryPoker = () => {
  return (
    <div className={styles.contain}>
      <div className={styles.containOption}>
        <img src={pokerTitle} alt="" className={styles.welcomeImg} />
        <div className={`${styles.option} no-text-select`}>
          <Link to="/gamepokerIA" className={styles.link}>
            VS CPU
          </Link>
          <Link to="/poker/joinRoom" className={styles.link}>
            Multiplayer
          </Link>
          <Link to="/poker/rules" className={styles.link}>
            Rules
          </Link>
          <Link to="/" className={styles.link}>
            Exit
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PagePrimaryPoker;

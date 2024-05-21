import { Link } from "react-router-dom";
import styles from "./pagePrimaryPoker.module.css";
import welcomeTitle from "../../../assets/poker/welcomeTitle.png";

const PagePrimaryPoker = () => {
  return (
    <div className={styles.contain}>
      <div className={styles.containOption}>
        <img src={welcomeTitle} alt="" className={styles.welcomeImg} />
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
            Exit{" "}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PagePrimaryPoker;

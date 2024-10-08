import { Link } from "react-router-dom";
import styles from "./pagePrimaryBerenjena.module.css";
import welcomeTitle from "../../../assets/berenjena/home/welcomeTitle.png";

const PagePrimaryBerenjena = () => {
  return (
    <div className={styles.contain}>
      <div className={styles.containOption}>
      <img src={welcomeTitle} alt="" className={styles.welcomeImg} />
        <div className={`${styles.option} no-text-select`}>
          <Link to="/" className={styles.link}>
            VS CPU
          </Link>
          <Link to="/joinRoom/berenjena" className={styles.link}>
            Multiplayer
          </Link>
          <Link to="/berenjena/rules" className={styles.link}>
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

export default PagePrimaryBerenjena;

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./PagePrimaryPoker.module.css";
import pokerTitle from "../../../assets/poker/pokerTitle.png";
import Loader from "../loader/loader";

const PagePrimaryPoker = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

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

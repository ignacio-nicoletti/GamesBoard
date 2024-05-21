// Loader.js
import React, { useEffect } from "react";
import styles from "./loader.module.css";
import pokerVideo from "../../../assets/poker/loaderPoker.mp4"
import pokerTitle from "../../../assets/poker/pokerTitle.png"

import AOS from "aos";
import "aos/dist/aos.css";

const Loader = () => {
  useEffect(() => {
    AOS.init({ duration: 100000 });
  }, []);
  return (
    <div className={styles.loaderContainer}>
      <video className={styles.loaderVideo} autoPlay loop muted>
        <source src={pokerVideo} type="video/mp4" />
      </video>
      <img src={pokerTitle} alt="Poker Logo" className={styles.loaderLogo} />
    </div>
  );
};

export default Loader;

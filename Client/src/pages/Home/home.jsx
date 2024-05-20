import { Link } from "react-router-dom";
import styles from "./home.module.css";
import PokerImg from "../../assets/pokerImg.png";
import BerenjenaImg from "../../assets/berenjenaImg.png";
import { useEffect } from "react";
import { connectSocket } from "../../functions/SocketIO/sockets/sockets";

const Home = () => {
  useEffect(() => {
    const initializeSocket = async () => {
      await connectSocket();
    };

    initializeSocket();
  }, []);

  return (
    <div className={styles.contain}>
      <div className={styles.containOption}>
        <h1>Place Your Bets</h1>
        <p className={styles.description}>
          Welcome to the multi-games platform. Enjoy card games you can play
          against the AI or in multiplayer mode, based on classic casino games.
        </p>
        <div className={styles.optionGrid}>
          <Link to="/berenjena" className={styles.link}>
            <div className={styles.gameCard}>
              <p>Berenjena</p>
              <img src={BerenjenaImg} alt="Berenjena game" />
            </div>
          </Link>

          <Link to="/poker" className={styles.link}>
            <div className={styles.gameCard}>
              <p>Poker</p>
              <img src={PokerImg} alt="Poker game" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

import { Link } from "react-router-dom";
import styles from "./home.module.css";
import PokerImg from "../../assets/homeFirst/pokerImg.png";
import BerenjenaImg from "../../assets/homeFirst/berenjenaImg.png";
import Horseimg from "../../assets/homeFirst/HorseCards.png";
import { useEffect } from "react";
import { disconnectServer } from "../../functions/SocketIO/sockets/sockets";
import SesionLogged from "../../components/homePage/sesionLogged/sesionLogged";

const Home = () => {
  useEffect(() => {
    return () => {
      disconnectServer();
    };
  }, []);

  return (
    <div className={styles.contain}>
      <SesionLogged />

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
          <Link to="/horserace" className={styles.link}>
            <div className={styles.gameCard}>
              <p>Horserace</p>
              <img src={Horseimg} alt="Horse Race" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

// tienda para objetos
// avatares, color en el name

//reutilizar componentes

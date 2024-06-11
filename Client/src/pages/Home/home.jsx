import {Link} from 'react-router-dom';
import styles from './home.module.css';
import PokerImg from '../../assets/homeFirst/pokerImg.png';
import BerenjenaImg from '../../assets/homeFirst/berenjenaImg.png';
import { useState} from 'react';
import Login from '../../components/berenjena/login/login';


// si estoy logeado se salga el login signup y aparezca la cuenta baierta y cerrar sesion
const Home = () => {
  const [isModalOpen, setModalOpen] = useState (false);
  const [isLogin, setIsLogin] = useState (true);

  const toggleModal = isLogin => {
    setIsLogin (isLogin);
    setModalOpen (!isModalOpen);
  };

  return (
    <div className={styles.contain}>
      <div className={styles.header}>
        <button
          className={styles.authButton}
          onClick={() => toggleModal (true)}
        >
          Log In
        </button>
        <button
          className={styles.authButton}
          onClick={() => toggleModal (false)}
        >
          Sing up
        </button>
      </div>
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
      {isModalOpen &&
        <Login isLogin={isLogin} onClose={() => setModalOpen (false)} />}
    </div>
  );
};

export default Home;

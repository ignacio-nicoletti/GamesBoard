import {Link} from 'react-router-dom';
import styles from './home.module.css';
import Ases from '../../assets/fourAses.png';
import truco from '../../assets/trucoo.png';
import joker from '../../assets/jocker.png';
import {useEffect} from 'react';
import {connectSocket} from '../../functions/SocketIO/sockets/sockets';

const Home = () => {
  useEffect (() => {
    const initializeSocket = async () => {
      await connectSocket ();
    };

    initializeSocket ();
  }, []);

  return (
    <div className={styles.contain}>
      <div className={styles.containOption}>

        <h1>Bienvenido al multijuegos</h1>

        <div className={styles.jocker}>
          <img src={joker} alt="" />
          <Link to="/rules" className={styles.link}>
            • Reglas 📜
          </Link>
        </div>
        <div className={styles.option}>

          <Link to="/berenjena" className={styles.link}>
            <div className={styles.Berenjena}>
              <p>Berenjena</p>
              <img src={truco} alt="" />
            </div>

          </Link>
          <Link to="/poker" className={styles.link}>
            <div className={styles.Poker}>
              <p>Poker</p>
              <img src={Ases} alt="" />
            </div>
          </Link>

          {/* <Link to="/rulesofberenjena" className={styles.link}>• Truco 📜</Link>
          <Link to="/rulesofberenjena" className={styles.link}>
            • Generala 📜
          </Link> */}
        </div>

      </div>
    </div>
  );
};
export default Home;

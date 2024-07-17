import {Link} from 'react-router-dom';
import styles from './PagePrimaryHorseGame.module.css';
import videoHorse from '../../../assets/horseGame/horsevideo.mp4';

const PagePrimaryHorseGame = () => {
  return (
    <div className={styles.contain}>
      <div className={styles.containOption}>
        <video className={styles.loaderVideo} autoPlay loop muted>
          <source src={videoHorse} type="video/mp4" />
        </video>
        <div className={styles.title}>
          <h1>Horse Race</h1>
        </div>
        <div className={`${styles.option} no-text-select`}>
          <Link to="/" className={styles.link}>
            VS CPU
          </Link>
          <Link to="/horserace/joinRoom" className={styles.link}>
            Multiplayer
          </Link>
          <Link to="/" className={styles.link}>
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

export default PagePrimaryHorseGame;

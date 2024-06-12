import { Link } from "react-router-dom";
import styles from "./home.module.css";
import PokerImg from "../../assets/homeFirst/pokerImg.png";
import BerenjenaImg from "../../assets/homeFirst/berenjenaImg.png";
import DefaultAvatar from "../../assets/berenjena/jugadores/DefaultAvatar.png";
import LogoutIcon from "@mui/icons-material/Logout";
import { useState, useEffect } from "react";
import Login from "../../components/berenjena/login/login";
import { GetDecodedCookie } from "../../utils/DecodedCookie";
import { DecodedToken } from "../../utils/DecodedToken";

const Home = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const token = GetDecodedCookie("cookieToken");
    if (token) {
      const data = DecodedToken(token);
      setUserInfo(data);
    }
  }, []);

  const toggleModal = (isLogin) => {
    setIsLogin(isLogin);
    setModalOpen(!isModalOpen);
  };

  const handleLogout = () => {
    document.cookie =
      "cookieToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setUserInfo(null);
    window.location.href = "/";
  };

  const handleLoginSuccess = () => {
    setModalOpen(false);
    window.location.reload();
  };

  return (
    <div className={styles.contain}>
      <div className={styles.header}>
        {userInfo ? (
          <div className={styles.userInfo}>
            <img
              src={userInfo.avatar || DefaultAvatar}
              alt="Avatar"
              className={styles.avatar}
            />
            Hello, <span>{userInfo.userName}</span>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              <LogoutIcon />
            </button>
          </div>
        ) : (
          <>
            <button
              className={styles.authButton}
              onClick={() => toggleModal(true)}
            >
              Log In
            </button>
            <button
              className={styles.authButton}
              onClick={() => toggleModal(false)}
            >
              Sign Up
            </button>
          </>
        )}
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
      {isModalOpen && (
        <Login
          isLogin={isLogin}
          onClose={() => setModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
};

export default Home;

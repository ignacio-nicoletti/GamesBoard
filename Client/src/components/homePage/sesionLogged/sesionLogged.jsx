import styles from "./sesionLogged.module.css";
import Cookies from "js-cookie";
import DefaultAvatar from "../../../assets/berenjena/jugadores/DefaultAvatar.png";
import LogoutIcon from "@mui/icons-material/Logout";
import StoreIcon from "@mui/icons-material/Store";
import HomeIcon from "@mui/icons-material/Home";
import { useEffect, useState } from "react";
import { GetDecodedCookie } from "../../../utils/DecodedCookie";
import { DecodedToken } from "../../../utils/DecodedToken";
import Login from "../login/login";
import { useLocation } from "react-router-dom";

const SesionLogged = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  let location = useLocation();

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
    Cookies.remove("cookieToken");
    setUserInfo(null);
    window.location.href = "/";
  };

  const handleLocation = () => {
    if (location.pathname === "/") {
      window.location.href = "/store";
    } else if (location.pathname === "/store") {
      window.location.href = "/";
    }
  };

  const handleLoginSuccess = () => {
    setModalOpen(false);
    window.location.reload();
  };

  return (
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
          <button className={styles.logoutBtn} onClick={handleLocation}>
            {location.pathname == "/" ? (
              <StoreIcon />
            ) : location.pathname == "/store" ? (
              <HomeIcon />
            ) : (
              ""
            )}
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

export default SesionLogged;

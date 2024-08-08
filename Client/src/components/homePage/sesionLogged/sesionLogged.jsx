import styles from "./sesionLogged.module.css";
import Cookies from "js-cookie";
import DefaultAvatar from "../../../assets/global/jugadores/DefaultAvatar.png";
import LogoutIcon from "@mui/icons-material/Logout";
import StoreIcon from "@mui/icons-material/Store";
import HomeIcon from "@mui/icons-material/Home";
import { useEffect, useState } from "react";
import { GetDecodedCookie } from "../../../utils/DecodedCookie";
import { DecodedToken } from "../../../utils/DecodedToken";
import Login from "../login/login";
import { useLocation } from "react-router-dom";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import InstanceOfAxios from "../../../utils/intanceAxios";

const SesionLogged = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  let location = useLocation();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = GetDecodedCookie("cookieToken");
        if (token) {
          const data = DecodedToken(token);

          const response = await InstanceOfAxios(
            `/user/${data.user.id}`,
            "GET"
          );

          setUserInfo(response.player);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
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
            src={userInfo.avatarProfile.url || DefaultAvatar}
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
          <span className={styles.logoutBtn}>
            {userInfo.coins}
            <MonetizationOnIcon />
          </span>
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

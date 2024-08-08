import { useEffect, useState } from "react";
import InstanceOfAxios from "../../../utils/intanceAxios";
import styles from "./choosename.module.css";
import { GetDecodedCookie } from "../../../utils/DecodedCookie";
import Swal from "sweetalert2";
import { DecodedToken } from "../../../utils/DecodedToken";

const ChooseName = ({ setShowModal, userInfo, setUserInfo }) => {
  const [writeName, setWriteName] = useState(userInfo.userName);
  const [selectedAvatar, setSelectedAvatar] = useState(userInfo.avatarProfile); // Estado para el avatar seleccionado
  const token = GetDecodedCookie("cookieToken"); //

  const handleSubmit = async () => {
    if (writeName && selectedAvatar) {
      setShowModal(false);
      if (token !== undefined) {
        await InstanceOfAxios(`/user/${userInfo.uid}`, "PUT", {
          userName: userInfo.userName,
          selectedAvatar,
        }).then((data) =>
          setUserInfo({ ...userInfo, userName: data.player.userName })
        );
      } else {
        setUserInfo({
          ...userInfo,
          userName: writeName,
          avatarPlayer: selectedAvatar,
        });
      }
    } else {
      Swal.fire({
        title: "Error!",
        text: "Please enter your name and select an avatar to continue.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          container: "swal2-container",
        },
      });
    }
  };

  const handlerChangeName = (e) => {
    setWriteName(e.target.value);
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (token) {
          setShowModal(false);
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

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <h2>Enter your name and choose an avatar</h2>
          <div className={styles.DivName}>
            <span>Name: </span>
            <input
              type="text"
              placeholder="Type your name here..."
              value={writeName}
              onChange={handlerChangeName}
              maxLength={15}
            />
          </div>
          <div className={styles.DivAvatars}>
            <p>Choose your Avatar</p>
            <div className={styles.DivAvatarsGrid}>
              {userInfo.avatares ? (
                userInfo.avatares.map((avatar, index) => (
                  <img
                    key={index}
                    src={avatar.url}
                    alt={avatar.name}
                    className={
                      selectedAvatar === avatar ? styles.selectedAvatar : ""
                    }
                    onClick={() => setSelectedAvatar(avatar)} // Almacena el objeto del avatar seleccionado
                  />
                ))
              ) : (
                <img
                  src={selectedAvatar.url}
                  alt={selectedAvatar.name}
                  className={
                    selectedAvatar === selectedAvatar
                      ? styles.selectedAvatar
                      : ""
                  }
                  onClick={() => setSelectedAvatar(selectedAvatar)} // Almacena el objeto del avatar seleccionado
                />
              )}
            </div>
          </div>
          <button onClick={handleSubmit}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default ChooseName;

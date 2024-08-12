import { useState } from "react";
import InstanceOfAxios from "../../../../utils/intanceAxios";
import styles from "./choosename.module.css";
import { GetDecodedCookie } from "../../../../utils/DecodedCookie";
import Swal from "sweetalert2";

const ChooseName = ({ setShowModal, userInfo, setUserInfo }) => {
  const [writeName, setWriteName] = useState(userInfo.userName);
  const [selectedAvatar, setSelectedAvatar] = useState(userInfo.avatarProfile); // Estado para el avatar seleccionado
  const token = GetDecodedCookie("cookieToken");

  const handleSubmit = async () => {
    if (writeName && selectedAvatar) {
      setShowModal(false);
      if (token !== undefined) {
        await InstanceOfAxios(`/user/${userInfo.uid}`, "PUT", {
          userName: writeName, // Corrige aquí para usar el nuevo nombre
          avatarProfile: selectedAvatar, // Aquí asegúrate de enviar el avatar correcto
        }).then((data) => {
          setUserInfo({
            ...userInfo,
            userName: data.player.userName,
            avatarProfile: data.player.avatarProfile,
          });
          setShowModal(false);
        });
      } else {
        setUserInfo({
          ...userInfo,
          userName: writeName,
          avatarProfile: selectedAvatar,
        });
        setShowModal(false);
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
              {userInfo.avatares &&
                userInfo.avatares.map((avatar, index) =>
                  avatar.image ? (
                    <img
                      key={index}
                      src={avatar.url}
                      alt={avatar.name}
                      onClick={() => setSelectedAvatar(avatar)} // Almacena el objeto del avatar seleccionado
                      className={
                        selectedAvatar === avatar ? styles.selectedAvatar : ""
                      }
                    />
                  ) : (
                    <video
                      key={index}
                      src={avatar.url}
                      autoPlay
                      loop
                      muted
                      onClick={() => setSelectedAvatar(avatar)} // Evento onClick para seleccionar video
                      className={
                        selectedAvatar === avatar ? styles.selectedAvatar : ""
                      }
                    />
                  )
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

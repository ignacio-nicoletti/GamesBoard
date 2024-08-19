import { useEffect, useState } from "react";
import SesionLogged from "../../components/homePage/sesionLogged/sesionLogged";
import { GetDecodedCookie } from "../../utils/DecodedCookie";
import { DecodedToken } from "../../utils/DecodedToken";
import InstanceOfAxios from "../../utils/intanceAxios";
import style from "./profile.module.css";

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [selectedColorName, setSelectedColorName] = useState(""); // Estado para almacenar la opción seleccionada
  const [updateName, setUpdateName] = useState("");
  const [isNameChanged, setIsNameChanged] = useState(false); // Estado para controlar si el nombre ha cambiado
  const token = GetDecodedCookie("cookieToken");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (token) {
          const data = DecodedToken(token);
          const response = await InstanceOfAxios(
            `/user/${data.user.id}`,
            "GET"
          );
          setUserInfo(response.player);
          setUpdateName(response.player.userName);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, [token]);

  const handleAvatarClick = (avatar) => {
    setSelectedAvatar(avatar);
  };

  const handleNameChange = (e) => {
    setUpdateName(e.target.value);
    setIsNameChanged(e.target.value !== userInfo.userName); // Verificar si el nombre ha cambiado
  };

  const updateProfile = async () => {
    if (userInfo && (selectedAvatar || isNameChanged)) {
      try {
        const updatedData = {
          avatarUpdateProfile: selectedAvatar,
          selectedColorName,
        };

        if (isNameChanged) {
          updatedData.userName = updateName; // Añadir el nuevo nombre si ha cambiado
        }

        const response = await InstanceOfAxios(`/user/${userInfo.uid}`, "PUT", updatedData);
        setUserInfo({
          ...userInfo,
          avatarProfile: response.player.avatarProfile,
          userName: response.player.userName, // Actualizar el nombre en el estado
        });
        window.location.reload();
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }
  };

  return (
    <div className={style.container}>
      <SesionLogged />
      <div className={style.avatarContainer}>
        <h3>Inventario</h3>

        <div>
          <input
            type="text"
            placeholder="Change your name"
            value={updateName}
            onChange={handleNameChange}
          />
        </div>

        <div className={style.avatarContainerMap}>
          {userInfo && userInfo.avatares && userInfo.avatares.length > 0 ? (
            userInfo.avatares.map((avatar) => (
              <div
                key={avatar.id}
                className={`${style.avatarCard} ${
                  selectedAvatar && selectedAvatar.uid === avatar.uid
                    ? style.selected
                    : ""
                }`}
                onClick={
                  avatar && avatar.title === "Rainbow Name"
                    ? () => {
                        setSelectedColorName(avatar.title);
                        handleAvatarClick(avatar);
                      }
                    : () => handleAvatarClick(avatar)
                }
              >
                {avatar.image ? (
                  <img
                    src={avatar.url}
                    alt={avatar.title}
                    className={style.avatarImage}
                  />
                ) : (
                  <video
                    autoPlay
                    loop
                    controls={false}
                    className={style.avatarVideo}
                  >
                    <source src={avatar.url} type="video/mp4" />
                  </video>
                )}
                <h3 className={style.avatarTitle}>{avatar.title}</h3>
                <p className={style.avatarDescription}>{avatar.description}</p>
                {avatar.category === "Paint" &&
                  avatar.title === "Color specific" && (
                    <select
                      name=""
                      id=""
                      onChange={(e) => setSelectedColorName(e.target.value)}
                    >
                      <option value="Red">Red</option>
                      <option value="Blue">Blue</option>
                      <option value="Green">Green</option>
                    </select>
                  )}
              </div>
            ))
          ) : (
            <p>No avatares found</p>
          )}
        </div>
        {(selectedAvatar || isNameChanged) && ( // Mostrar botón solo si hay un avatar seleccionado o si el nombre ha cambiado
          <div className={style.updateButton}>
            <button onClick={updateProfile} disabled={!selectedAvatar?.title && !isNameChanged}>
              Update Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

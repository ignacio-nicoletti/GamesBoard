import { useEffect, useState } from "react";
import SesionLogged from "../../components/homePage/sesionLogged/sesionLogged";
import { GetDecodedCookie } from "../../utils/DecodedCookie";
import { DecodedToken } from "../../utils/DecodedToken";
import InstanceOfAxios from "../../utils/intanceAxios";
import style from "./profile.module.css";

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
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

  const updateProfile = async () => {
    if (userInfo && selectedAvatar) {
      try {
        const response = await InstanceOfAxios(`/user/${userInfo.uid}`, "PUT", {
          avatarProfile: selectedAvatar,
        });
        setUserInfo({
          ...userInfo,
          avatarProfile: response.player.avatarProfile,
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
                onClick={() => handleAvatarClick(avatar)}
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
              </div>
            ))
          ) : (
            <p>No avatares found</p>
          )}
        </div>
        {selectedAvatar && (
          <div className={style.updateButton}>
            <button onClick={updateProfile} disabled={!selectedAvatar.title}>Update Profile</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

import SesionLogged from "../../components/homePage/sesionLogged/sesionLogged";
import style from "./store.module.css";
import { useEffect, useState } from "react";
import InstanceOfAxios from "../../utils/intanceAxios";
import { DecodedToken } from "../../utils/DecodedToken";
import { GetDecodedCookie } from "../../utils/DecodedCookie";

const Store = () => {
  const [dataStore, setDataStore] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const token = GetDecodedCookie("cookieToken");

  useEffect(() => {
    const fetchConsumables = async () => {
      try {
        const response = await InstanceOfAxios(`/consumable`, "GET");
        if (response) {
          setDataStore(response);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchConsumables();
  }, []);

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
  }, [token]); // Asegúrate de incluir `token` en las dependencias

  // Función para verificar si el botón debe estar deshabilitado
  const isButtonDisabled = (requirements, price) => {
    if (!requirements || !Array.isArray(requirements)) return true;

    const experience = userInfo.experience || {}; // Asegúrate de que `experience` esté definido
    const userCoins = userInfo.coins || 0; // Asegúrate de que `coins` esté definido

    const hasRequiredLevels = requirements.every((requirement) => {
      const requiredLevelB = requirement.levelB || 0;
      const requiredLevelH = requirement.levelH || 0;

      const userLevelB = experience["Berenjena"]?.level || 0;
      const userLevelH = experience["Horserace"]?.level || 0;

      return userLevelB >= requiredLevelB && userLevelH >= requiredLevelH;
    });

    const hasEnoughCoins = userCoins >= price;

    return !(hasRequiredLevels && hasEnoughCoins);
  };

  return (
    <div className={style.contain}>
      <SesionLogged />

      <div className={style.title}>
        <p>Store</p>
      </div>

      <div className={style.MapProducts}>
        {dataStore.map((el, index) => (
          <div key={index} className={style.cardProduct}>
            <p className={style.titleCard}>{el.title}</p>
            <div className={style.cardProductMedia}>
              {el.image ? (
                <img src={el.url} alt={el.title} />
              ) : (
                <video autoPlay loop controls={false}>
                  <source src={el.url} type="video/mp4" />
                </video>
              )}
            </div>
            <div className={style.descriptionDiv}>
              <p
                className={
                  el.title === "Rainbow Name"
                    ? style.rainbow_text
                    : el.title === "Color specific"
                    ? style.rgb_text
                    : style.description
                }
              >
                {el.description}
              </p>
            </div>
            <div className={style.priceDiv}>
              <p>${el.price}</p>
            </div>
            <div className={style.NecesaryDiv}>
              <p>
                Necesary:{" "}
                {el.levelNecesary.map((level, index) => (
                  <span key={index}>
                    Berenjena: Lvl{" "}
                    <span className={style.NecesaryValue}>
                      {level.levelB || 0}
                    </span>{" "}
                    - HorseRace: Lvl{" "}
                    <span className={style.NecesaryValue}>
                      {level.levelH || 0}
                    </span>
                    {index < el.levelNecesary.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
            </div>

            <button
              disabled={isButtonDisabled(el.levelNecesary, el.price)}
            >
              OBTAIN
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Store;

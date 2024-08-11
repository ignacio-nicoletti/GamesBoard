import SesionLogged from "../../components/homePage/sesionLogged/sesionLogged";
import style from "./store.module.css";
import { useEffect, useState } from "react";
import InstanceOfAxios from "../../utils/intanceAxios";
import { DecodedToken } from "../../utils/DecodedToken";
import { GetDecodedCookie } from "../../utils/DecodedCookie";
import ModalTicket from "../../components/store/modalTicket/modalTicket";

const Store = () => {
  const [dataStore, setDataStore] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [showModalTicket, setShowModalTicket] = useState(false);
  const [selectConsumable, setSelectConsumable] = useState({});

  const token = GetDecodedCookie("cookieToken");

  const fetchUserInfo = async () => {
    try {
      if (token) {
        const data = DecodedToken(token);

        const response = await InstanceOfAxios(`/user/${data.user.id}`, "GET");
        setUserInfo(response.player);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

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

  useEffect(() => {
    fetchConsumables();
    fetchUserInfo();
  }, [token]);

  const isButtonDisabled = (requirements, price, consumable) => {
    if (!requirements || !Array.isArray(requirements)) return true;

    const experienceArray = userInfo.experience || [];
    const userCoins = userInfo.coins || 0;

    // Convertir el array de experiencia en un objeto para un acceso más fácil
    const experience = experienceArray.reduce((acc, exp) => {
      const gameName = Object.keys(exp)[0]; // Extrae el nombre del juego
      acc[gameName] = exp[gameName]; // Asigna el objeto de experiencia al nombre del juego
      return acc;
    }, {});

    // Verificar si el consumable ya está en los avatares del usuario
    const hasConsumable = userInfo.avatares?.some(
      (avatar) => avatar._id === consumable.uid || avatar.uid === consumable.uid
    );

    // Verificar si el usuario cumple con los niveles requeridos
    const hasRequiredLevels = requirements.every((requirement) => {
      const requiredLevelB = requirement.levelB || 0;
      const requiredLevelH = requirement.levelH || 0;

      const userLevelB = experience["Berenjena"]?.level || 0;
      const userLevelH = experience["Horserace"]?.level || 0;

      return userLevelB >= requiredLevelB && userLevelH >= requiredLevelH;
    });

    const hasEnoughCoins = userCoins >= price;

    // Deshabilitar el botón si no tiene los niveles requeridos, no tiene suficientes monedas o ya posee el consumable
    return !hasRequiredLevels || !hasEnoughCoins || hasConsumable;
  };

  return (
    <div className={style.contain}>
      <SesionLogged />

      <div className={style.MapProducts}>
        <div className={style.title}>
          <p>Store</p>
        </div>
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
              disabled={isButtonDisabled(el.levelNecesary, el.price, el)}
              onClick={() => {
                setSelectConsumable(el);
                setShowModalTicket(true);
              }}
            >
              OBTAIN
            </button>
          </div>
        ))}

        {showModalTicket && (
          <ModalTicket
            setShowModalTicket={setShowModalTicket}
            selectConsumable={selectConsumable}
            setSelectConsumable={setSelectConsumable}
            userInfo={userInfo}
            fetchUserInfo={fetchUserInfo}
            fetchConsumables={fetchConsumables}
          />
        )}
      </div>
    </div>
  );
};

export default Store;

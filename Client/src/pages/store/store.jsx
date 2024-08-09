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
  }, [token]);

  const isButtonDisabled = (requirements, price) => {
    if (!requirements || !Array.isArray(requirements)) return true;

    const experience = userInfo.experience || {};
    const userCoins = userInfo.coins || 0;

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
          />
        )}
      </div>
    </div>
  );
};

export default Store;

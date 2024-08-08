import SesionLogged from "../../components/homePage/sesionLogged/sesionLogged";
import style from "./store.module.css";
import { useEffect, useState } from "react";
import InstanceOfAxios from "../../utils/intanceAxios";

const Store = () => {
  const [dataStore, setDataStore] = useState([]);

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

  return (
    <div className={style.contain}>
      <SesionLogged />

      <div className={style.title}>
        <p>Store</p>
      </div>

      <div className={style.MapProducts}>
        {dataStore.map((el) => (
          <div className={style.cardProduct}>
            <p className={style.titleCard}>{el.title}</p>
            <div className={style.cardProductMedia}>
              {el.image === true ? (
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
                Necesary :{" "}
                {el.levelNecesary.map((level, index) => (
                  <span key={index}>
                    Berenjena: Lvl{" "}
                    <span className={style.NecesaryValue}>{level.levelB}</span>{" "}
                    - HorseRace: Lvl{" "}
                    <span className={style.NecesaryValue}>{level.levelH}</span>
                    {index < el.levelNecesary.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
            </div>

            <button>OBTAIN</button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Store;

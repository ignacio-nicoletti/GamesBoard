import style from "./modalTicket.module.css";
import CancelIcon from "@mui/icons-material/Cancel";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import InstanceOfAxios from "../../../utils/intanceAxios";

const ModalTicket = ({
  setShowModalTicket,
  selectConsumable,
  setSelectConsumable,
  userInfo,
}) => {
    
  const handleSubmit = async () => {
    setShowModalTicket(false);
    await InstanceOfAxios(`/consumable/${userInfo.uid}`, "PUT", {
      selectConsumable,
    });
  };

 

  return (
    <div className={style.modal}>
      <div className={style.modalContent}>
        <div
          className={style.modalCancel}
          onClick={() => {
            setShowModalTicket(false);
            setSelectConsumable({});
          }}
        >
          <div className={style.modalCancelMOney}>
            <p>{userInfo.coins}</p>
            <MonetizationOnIcon />
          </div>
          <CancelIcon className={style.modalCancel_button} />
        </div>
        <h2>Ticket</h2>

        <div className={style.DivAvatars}>
          <p>{selectConsumable.title}</p>

          <div className={style.cardProductMedia}>
            {selectConsumable.image ? (
              <img src={selectConsumable.url} alt={selectConsumable.title} />
            ) : (
              <video autoPlay loop controls={false}>
                <source src={selectConsumable.url} type="video/mp4" />
              </video>
            )}
          </div>
          <div className={style.descriptionDiv}>
            <p
              className={
                selectConsumable.title === "Rainbow Name"
                  ? style.rainbow_text
                  : selectConsumable.title === "Color specific"
                  ? style.rgb_text
                  : style.description
              }
            >
              {selectConsumable.description}
            </p>
          </div>
          <div className={style.priceDiv}>
            <p>${selectConsumable.price}</p>
          </div>
          <div className={style.NecesaryDiv}>
            <p>
              Necesary:{" "}
              {selectConsumable.levelNecesary.map((level, index) => (
                <span key={index}>
                  Berenjena: Lvl{" "}
                  <span className={style.NecesaryValue}>
                    {level.levelB || 0}
                  </span>{" "}
                  - HorseRace: Lvl{" "}
                  <span className={style.NecesaryValue}>
                    {level.levelH || 0}
                  </span>
                  {index < selectConsumable.levelNecesary.length - 1
                    ? ", "
                    : ""}
                </span>
              ))}
            </p>
          </div>
        </div>
        <button onClick={handleSubmit}>Save</button>
      </div>
    </div>
  );
};

export default ModalTicket;

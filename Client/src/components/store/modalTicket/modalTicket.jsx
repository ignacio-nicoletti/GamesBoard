import style from "./modalTicket.module.css";
import CancelIcon from "@mui/icons-material/Cancel";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import InstanceOfAxios from "../../../utils/intanceAxios";
import Swal from "sweetalert2";
import { useState } from "react";

const ModalTicket = ({
  setShowModalTicket,
  selectConsumable,
  setSelectConsumable,
  userInfo,
  fetchUserInfo,
  fetchConsumables,
}) => {
  const [selectedGame, setSelectedGame] = useState(""); // Estado para almacenar la opción seleccionada

  const handleSubmit = async () => {
    setShowModalTicket(false);
    try {
      await InstanceOfAxios(`/consumable/${userInfo.uid}`, "PUT", {
        selectConsumable,
        selectedGame, // Incluimos la opción seleccionada en el objeto a enviar
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Ocurrió un error en la compra, intente de nuevo más tarde.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          container: "swal2-container",
        },
      });
    }

    // Llamar a fetchUserInfo para actualizar la información del usuario
    fetchUserInfo();
    fetchConsumables();
  };

  return (
    <div className={style.modal}>
      <div className={style.modalContent}>
        <div className={style.modalCancel}>
          <div className={style.modalCancelMOney}>
            <p>{userInfo.coins}</p>
            <MonetizationOnIcon />
          </div>
          <p>Ticket</p>
          <CancelIcon
            className={style.modalCancel_button}
            onClick={() => {
              setShowModalTicket(false);
              setSelectConsumable({});
            }}
          />
        </div>

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
        {selectConsumable.category === "XP" && (
          <div className={style.Divselect}>
            <select
              name="Games"
              id=""
              value={selectedGame} // Establecemos el valor actual del estado
              onChange={(e) => setSelectedGame(e.target.value)} // Actualizamos el estado cuando cambia la selección
            >
              <option value="" disabled={true}>
                Select a game
              </option>
              <option value="Berenjena">Berenjena</option>
              <option value="Horserace">Horserace</option>
            </select>
          </div>
        )}
        <button onClick={handleSubmit}>Finish</button>
      </div>
    </div>
  );
};

export default ModalTicket;

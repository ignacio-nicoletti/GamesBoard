import React from "react";
import Cards from "../cards/cards";
import styles from "./horseContain.module.css";

const HorseContain = () => {
  // Clases para las diferentes posiciones en el eje Y
  const yClasses = [
    styles.yPos1,
    styles.yPos2,
    styles.yPos3,
    styles.yPos4,
    styles.yPos5,
    styles.yPos6,
  ];

  // Función para seleccionar una clase aleatoria de posición Y
  const getRandomYClass = () => {
    const randomIndex = Math.floor(Math.random() * yClasses.length);
    return yClasses[2];
  };

  return (
    <div className={styles.Contain}>
      <div className={styles.cardsContain}>
        <div className={`${styles.cards} ${getRandomYClass()}`}>
          <Cards value={"11"} suit={"oro"} />
        </div>
        <div className={`${styles.cards} ${getRandomYClass()}`}>
          <Cards value={"11"} suit={"espada"} />
        </div>
        <div className={`${styles.cards} ${getRandomYClass()}`}>
          <Cards value={"11"} suit={"basto"} />
        </div>
        <div className={`${styles.cards} ${getRandomYClass()}`}>
          <Cards value={"11"} suit={"copa"} />
        </div>
      </div>
    </div>
  );
};

export default HorseContain;

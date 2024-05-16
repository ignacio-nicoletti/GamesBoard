import React, { useEffect, useState } from 'react';
import style from './apuesta.module.css';


const Apuesta = ({ setJugador1, jugador1, setJugador2, jugador2, setJugador3, jugador3, setJugador4, jugador4, ronda, setRonda }) => {
  const [apuesta, setApuesta] = useState(0)

  const [estadoactivo, setEstadoactivo] = useState({
    card0: false,
    card1: false,
    card2: false,
    card3: false,
    card4: false,
    card5: false,
    card6: false,
    card7: false,
  })

  const ComienzoTurnoApuesta = () => {
    const turnoJ = ronda.obligado;
    switch (turnoJ) {
      case 1:
        setRonda({ ...ronda, turnoJugadorA: 2 });
        break;
      case 2:
        setRonda({ ...ronda, turnoJugadorA: 3 });
        break;
      case 3:
        setRonda({ ...ronda, turnoJugadorA: 4 });
        break;
      case 4:
        setRonda({ ...ronda, turnoJugadorA: 1 });
        break;
      default:
        break;
    }
  }

  const cambiotypeRound = () => {
    if (jugador1.apuestaP !== null && jugador2.apuestaP !== null && jugador3.apuestaP !== null && jugador4.apuestaP !== null) {
      if (ronda.obligado === 1 || ronda.obligado === 2 || ronda.obligado === 3) {
        setRonda({ ...ronda, typeRound: "ronda", turnoJugadorR: ronda.obligado + 1 })   // cambio de ronda
      } else {
        setRonda({ ...ronda, typeRound: "ronda", turnoJugadorR: 1 })// cambio de ronda
      }
    }
  }

  const apostar = (event) => {

    setApuesta(event.target.value)
    if (ronda.typeRound === "apuesta" && ronda.turnoJugadorA === ronda.obligado) {
      if (
        Number(event.target.value) === 0 &&
        Number(ronda.cardPorRonda) ===
        Number(ronda.ApuestaTotal) + Number(event.target.value)
      ) {
        setEstadoactivo({ estadoactivo, card0: true });
      }
      if (
        Number(event.target.value) === 1 &&
        Number(ronda.cardPorRonda) ===
        Number(ronda.ApuestaTotal) + Number(event.target.value)
      ) {
        setEstadoactivo({ estadoactivo, card1: true });
      }
      if (
        Number(event.target.value) === 2 &&
        Number(ronda.cardPorRonda) ===
        Number(ronda.ApuestaTotal) + Number(event.target.value)
      ) {
        setEstadoactivo({ estadoactivo, card2: true });
      }
      if (
        Number(event.target.value) === 3 &&
        Number(ronda.cardPorRonda) ===
        Number(ronda.ApuestaTotal) + Number(event.target.value)
      ) {
        setEstadoactivo({ estadoactivo, card3: true });
      }
      if (
        Number(event.target.value) === 4 &&
        Number(ronda.cardPorRonda) ===
        Number(ronda.ApuestaTotal) + Number(event.target.value)
      ) {
        setEstadoactivo({ estadoactivo, card4: true });
      }
      if (
        Number(event.target.value) === 5 &&
        Number(ronda.cardPorRonda) ===
        Number(ronda.ApuestaTotal) + Number(event.target.value)
      ) {
        setEstadoactivo({ estadoactivo, card5: true });
      }
      if (
        Number(event.target.value) === 6 &&
        Number(ronda.cardPorRonda) ===
        Number(ronda.ApuestaTotal) + Number(event.target.value)
      ) {
        setEstadoactivo({ estadoactivo, card6: true });
      }
      if (
        Number(event.target.value) === 7 &&
        Number(ronda.cardPorRonda) ===
        Number(ronda.ApuestaTotal) + Number(event.target.value)
      ) {
        setEstadoactivo({ estadoactivo, card7: true });
      }
    }//lo hace bien pero una vez que mande el numero, tiene que hacerlo antes
  }

  useEffect(() => {
    cambiotypeRound()

  }, [ronda.turnoJugadorA])

  useEffect(() => {
    if (ronda.typeRound === "apuesta") {
      ComienzoTurnoApuesta()//cuando se monta el componente determina quien arranca

    }
  }, [])

  const handleSubmit = () => {
    const turnoJugador = ronda.turnoJugadorA;
    switch (turnoJugador) {
      case 1:
        setJugador1({ ...jugador1, apuestaP: Number(apuesta) });
        setRonda({ ...ronda, turnoJugadorA: 2, ApuestaTotal: Number(apuesta) });
        break;
      case 2:
        setJugador2({ ...jugador2, apuestaP: Number(apuesta) });
        setRonda({ ...ronda, turnoJugadorA: 3, ApuestaTotal: ronda.ApuestaTotal + Number(apuesta) });
        break;
      case 3:
        setJugador3({ ...jugador3, apuestaP: Number(apuesta) });
        setRonda({ ...ronda, turnoJugadorA: 4, ApuestaTotal: ronda.ApuestaTotal + Number(apuesta) });
        break;
      case 4:
        setJugador4({ ...jugador4, apuestaP: Number(apuesta) });
        setRonda({ ...ronda, turnoJugadorA: 1, ApuestaTotal: ronda.ApuestaTotal + Number(apuesta) });
        break;
      default:
        break;
    }
  };
  return (<>

    <div className={style.contain}>
      <p>jugador {ronda.turnoJugadorA}</p>

      <select name="select" onChange={(event) => apostar(event)}>
        <option value={"Elige tu apuesta"} disabled={true}> Elige tu apuesta </option>
        {[...Array(ronda.cardPorRonda + 1)].map((_, index) => (
          <option
            key={index}
            value={index}
            disabled={index === 0 ? estadoactivo.card0 : estadoactivo[`card${index}`]}
          >
            {index} cartas
          </option>
        ),

        )}
      </select>
      <button onClick={handleSubmit}>Enviar</button>
    </div>
  </>
  );
};

export default Apuesta;

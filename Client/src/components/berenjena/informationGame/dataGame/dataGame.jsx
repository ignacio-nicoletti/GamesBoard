import style from "./dataGame.module.css"
const DataGame=({ronda})=>{
    return(
        <div className={style.infoPartida}>
              <p>tipo: {ronda.typeRound} </p>
              <p>Obligado: jugador{ronda.obligado}</p>
              <p>Cartas Repartidas: {ronda.cardPorRonda} </p>
              <p>Apuesta total: {ronda.ApuestaTotal}</p>
              <p>
                Carta Ganadora:

                {' ' + ronda.CardGanadoraxRonda[0].valor + ' '}

                {ronda.CardGanadoraxRonda[0].palo}
              </p>
              <p>Vuelta: {ronda.vuelta}</p>
              <p>Ronda: {ronda.numeroRonda}</p>
              <p>
                turno: jugador
                {ronda.typeRound === 'apuesta'
                  ? ronda.turnoJugadorA
                  : ronda.turnoJugadorR}
              </p>
            </div>
    )
}
export default DataGame;
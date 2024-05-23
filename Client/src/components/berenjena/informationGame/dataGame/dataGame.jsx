import style from "./dataGame.module.css"
const DataGame=({ronda})=>{
    return(
        <div className={style.infoPartida}>
              <p>tipo: {ronda.typeRound} </p>
              <p>Obligado: jugador{ronda.obligado}</p>
              <p>Cartas Repartidas: {ronda.cardXRound} </p>
              <p>Apuesta total: {ronda.betTotal}</p>
              <p>
                Carta Ganadora:

                {' ' + ronda.cardWinxRound[0].valor + ' '}

                {ronda.cardWinxRound[0].palo}
              </p>
              <p>Vuelta: {ronda.vuelta}</p>
              <p>Ronda: {ronda.numeroRonda}</p>
              <p>
                turno: jugador
                {ronda.typeRound === 'apuesta'
                  ? ronda.turnJugadorA
                  : ronda.turnJugadorR}
              </p>
            </div>
    )
}
export default DataGame;
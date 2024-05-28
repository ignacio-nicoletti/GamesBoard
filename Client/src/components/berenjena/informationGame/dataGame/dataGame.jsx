import style from "./dataGame.module.css"
const DataGame=({round})=>{

 
    return(
        <div className={style.infoPartida}>
              <p>tipo: {round?.typeRound} </p>
              <p>Obligado: jugador{round?.obligado}</p>
              <p>Cartas Repartidas: {round?.cardXRound} </p>
              <p>Apuesta total: {round?.betTotal}</p>
              <p>
                Carta Ganadora:

                {' ' + round?.cardWinxRound[0].valor + ' '}

                {round?.cardWinxRound[0].palo}
              </p>
              <p>Vuelta: {round?.vuelta}</p>
              <p>Ronda: {round?.numeroRonda}</p>
              <p>
                turno: jugador
                {round?.typeRound === 'apuesta'
                  ? round?.turnJugadorA
                  : round?.turnJugadorR}
              </p>
            </div>
    )
}
export default DataGame;
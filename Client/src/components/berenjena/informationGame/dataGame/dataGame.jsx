import style from "./dataGame.module.css"
const DataGame=({round})=>{

 
    return(
        <div className={style.infoPartida}>
              <p>tipo: {round?.typeRound} </p>
              <p>Obligado: jugador{round?.obligado}</p>
       
              <p>Apuesta total: {round?.betTotal}</p>
              <p>
                Carta Ganadora:

                {' ' + round?.cardWinxRound.value + ' '}

                {round?.cardWinxRound.suit}
              </p>
              <p>Ronda: {round?.numeroRonda}</p>
              <p>
                turno: jugador
                {round?.typeRound === 'Bet'
                  ? round?.turnJugadorA
                  : round?.turnJugadorR}
              </p>
            </div>
    )
}
export default DataGame;
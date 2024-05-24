import {useEffect, useState} from 'react';
import style from './berenjena.module.css';

import Jugadores from '../../../components/berenjena/jugadores/jugadores';
import Cards from '../../../components/berenjena/cards/card';

import Loader from '../../../components/berenjena/loader/loader';
import DataGame
  from '../../../components/berenjena/informationGame/dataGame/dataGame';
import DataPlayer
  from '../../../components/berenjena/informationGame/dataPlayer/dataPlayer';
import Result
  from '../../../components/berenjena/informationGame/Results/result';

import {
  AsignarMayor,
  distribute,
  turno,
} from '../../../functions/logica/logica.js';

import Apuesta from '../../../components/berenjena/apuesta/apuesta';
import ButtonExitRoom
  from '../../../components/berenjena/buttonExitRoom/buttonExitRoom.jsx';
import {socket} from '../../../functions/SocketIO/sockets/sockets';

const GameBerenjena = () => {
  const [loader, setLoader] = useState (true);
  const [game, setGame] = useState ('Berenjena'); // Juego seleccionado
  const [showResult, setShowResult] = useState (false);
  const [myPosition, setMyPosition] = useState ({});
 
  const [players, setPlayers] = useState ([
    {
      userName: '', //nombre
      id: 1, //position
      cardPerson: [], //cards
      betP: null, //num de cards apostadas
      cardswins: 0, //cards ganadas
      cardBet: [{value: null, palo: ''}], //card apostada
      myturnA: false, //boolean  //turno apuesta
      myturnR: false, //boolean //turno ronda
      cumplio: false, //boolean  //cumplio su apuesta
      points: 0, //puntos
    },
    {
      userName: '',
      id: 2,
      cardPerson: [],
      betP: null,
      cardswins: 0,
      cardBet: [{value: null, palo: ''}],
      myturnA: false, //boolean
      myturnR: false, //booleanA
      cumplio: false, //boolean
      points: 0,
    },
    {
      userName: '',
      id: 3,
      cardPerson: [],
      betP: null,
      cardswins: 0,
      cardBet: [{value: null, palo: ''}],
      myturnA: false, //boolean
      myturnR: false, //booleanA
      cumplio: false, //boolean
      points: 0,
    },
    {
      userName: '',
      id: 4,
      cardPerson: [],
      betP: null,
      cardswins: 0,
      cardBet: [{value: null, palo: ''}],
      myturnA: false, //boolean
      myturnR: false, //booleanA
      cumplio: false, //boolean
      points: 0,
    },
    {
      userName: '',
      id: 5,
      cardPerson: [],
      betP: null,
      cardswins: 0,
      cardBet: [{value: null, palo: ''}],
      myturnA: false, //boolean
      myturnR: false, //booleanA
      cumplio: false, //boolean
      points: 0,
    },
    {
      userName: '',
      id: 6,
      cardPerson: [],
      betP: null,
      cardswins: 0,
      cardBet: [{value: null, palo: ''}],
      myturnA: false, //boolean
      myturnR: false, //booleanA
      cumplio: false, //boolean
      points: 0,
    },
  ]);

  const [round, setRound] = useState ({
    users: 4, //usuarios conectados
    vuelta: 1, //num de vuelta (4 rondas =1 vuelta)
    numRound: 1, //num de ronda
    cardXRound: 1, //cant de cartas que se reparten
    typeRound: '', //apuesta o ronda
    turnJugadorA: 1, //1j 2j 3j 4j apuesta
    turnJugadorR: 1, //1j 2j 3j 4j ronda
    obligado: null, //numero de jugador obligado
    betTotal: 0, //suma de la apuesta de todos
    cardWinxRound: [{value: null, palo: '', id: ''}], //card ganada en la ronda
    lastCardBet: [{value: null, palo: '', id: ''}], //ultima card apostada
    beforeLastCardBet: [{value: null, palo: '', id: ''}], //anteultima card apostada
    ganadorRonda: null,
    cantQueTiraron: 0,
    roomId: null,
  });

  const [Base, setBase] = useState ([]); //base del resultado xronda

  // const setTurnoRound = () => {
  //   let turno = ronda.CardGanadoraxRonda[0].id;

  //   switch (turno) {
  //     case 1:
  //       setRonda ({
  //         ...ronda,
  //         turnoJugadorR: 1,
  //       });
  //       break;
  //     case 2:
  //       setRonda ({
  //         ...ronda,
  //         turnoJugadorR: 2,
  //       });

  //       break;
  //     case 3:
  //       setRonda ({
  //         ...ronda,
  //         turnoJugadorR: 3,
  //       });
  //       break;
  //     case 4:
  //       setRonda ({
  //         ...ronda,
  //         turnoJugadorR: 4,
  //       });
  //       break;

  //     default:
  //       break;
  //   }
  // };

  // const cambioDeVuelta = () => {
  //   if (ronda.cardPorRonda === 1 && ronda.numeroRonda === 2) {
  //     setRonda ({
  //       ...ronda,
  //       vuelta: ronda.vuelta + 1,
  //       cantQueApostaron: 0,
  //       cantQueTiraron: 0,
  //       numeroRonda: 1,
  //       cardPorRonda: ronda.cardPorRonda + 2,
  //     });
  //   }
  //   if (ronda.cardPorRonda === 3 && ronda.numeroRonda === 4) {
  //     setRonda ({
  //       ...ronda,
  //       vuelta: ronda.vuelta + 1,
  //       cantQueApostaron: 0,
  //       cantQueTiraron: 0,
  //       numeroRonda: 1,
  //       cardPorRonda: ronda.cardPorRonda + 2,
  //     });
  //   }
  //   if (ronda.cardPorRonda === 5 && ronda.numeroRonda === 6) {
  //     setRonda ({
  //       ...ronda,
  //       vuelta: ronda.vuelta + 1,
  //       cantQueApostaron: 0,
  //       cantQueTiraron: 0,
  //       numeroRonda: 1,
  //       cardPorRonda: ronda.cardPorRonda + 2,
  //     });
  //   }
  //   if (ronda.cardPorRonda === 7 && ronda.numeroRonda === 8) {
  //     setRonda ({
  //       ...ronda,
  //       cardPorRonda: 1,
  //       vuelta: ronda.vuelta + 1,
  //       cantQueApostaron: 0,
  //       cantQueTiraron: 0,
  //       numeroRonda: 1,
  //     });
  //   }
  // };

  // const cambioRonda = () => {
  //   setRonda ({
  //     ...ronda,
  //     turnoJugadorR: ronda.CardGanadoraxRonda[0].id,
  //     cantQueTiraron: 0,
  //     numeroRonda: ronda.numeroRonda + 1,
  //     ultimaCardApostada: [{valor: '', palo: '', id: ''}],
  //     CardGanadoraxRonda: [{valor: '', palo: '', id: ''}],
  //   });
  // };

  // const Cumplio = () => {
  //   if (jugador1.apuestaP === jugador1.cardsganadas) {
  //     setJugador1 ({...jugador1, cumplio: true});
  //   }
  //   if (jugador2.apuestaP === jugador2.cardsganadas) {
  //     setJugador2 ({...jugador2, cumplio: true});
  //   }
  //   if (jugador3.apuestaP === jugador3.cardsganadas) {
  //     setJugador3 ({...jugador3, cumplio: true});
  //   }
  //   if (jugador4.apuestaP === jugador4.cardsganadas) {
  //     setJugador4 ({...jugador4, cumplio: true});
  //   }
  // };

  // const puntos = () => {
  //   if (jugador1.cumplio === true) {
  //     setJugador1 ({
  //       ...jugador1,
  //       puntos: jugador1.puntos + 5 + jugador1.cardsganadas,
  //     });
  //   } else {
  //     setJugador1 ({...jugador1, puntos: jugador1.puntos});
  //   }

  //   if (jugador2.cumplio === true) {
  //     setJugador2 ({
  //       ...jugador2,
  //       puntos: jugador2.puntos + 5 + jugador2.cardsganadas,
  //     });
  //   } else {
  //     setJugador2 ({...jugador2, puntos: jugador2.puntos});
  //   }

  //   if (jugador3.cumplio === true) {
  //     setJugador3 ({
  //       ...jugador3,
  //       puntos: jugador3.puntos + 5 + jugador3.cardsganadas,
  //     });
  //   } else {
  //     setJugador3 ({...jugador3, puntos: jugador3.puntos});
  //   }

  //   if (jugador4.cumplio === true) {
  //     setJugador4 ({
  //       ...jugador4,
  //       puntos: jugador4.puntos + 5 + jugador4.cardsganadas,
  //     });
  //   } else {
  //     setJugador4 ({...jugador4, puntos: jugador4.puntos});
  //   }
  // };

  // const SumarGanada = () => {
  //   switch (ronda.CardGanadoraxRonda[0].id) {
  //     case 1:
  //       setJugador1 ({...jugador1, cardsganadas: jugador1.cardsganadas + 1});
  //       break;
  //     case 2:
  //       setJugador2 ({...jugador2, cardsganadas: jugador2.cardsganadas + 1});
  //       break;
  //     case 3:
  //       setJugador3 ({...jugador3, cardsganadas: jugador3.cardsganadas + 1});
  //       break;
  //     case 4:
  //       setJugador4 ({...jugador4, cardsganadas: jugador4.cardsganadas + 1});
  //       break;

  //     default:
  //       break;
  //   }
  // };

  // const resetPlayers = () => {
  //   setJugador1 ({
  //     ...jugador1,
  //     cardApostada: [{valor: null, palo: ''}],
  //     apuestaP: null,
  //     cumplio: false,
  //     cardsganadas: 0,
  //   });
  //   setJugador2 ({
  //     ...jugador2,
  //     cardApostada: [{valor: null, palo: ''}],
  //     apuestaP: null,
  //     cumplio: false,
  //     cardsganadas: 0,
  //   });
  //   setJugador3 ({
  //     ...jugador3,
  //     cardApostada: [{valor: null, palo: ''}],
  //     apuestaP: null,
  //     cumplio: false,
  //     cardsganadas: 0,
  //   });
  //   setJugador4 ({
  //     ...jugador4,
  //     cardApostada: [{valor: null, palo: ''}],
  //     apuestaP: null,
  //     cumplio: false,
  //     cardsganadas: 0,
  //   });
  // };

  // const resetRound = () => {
  //   if (ronda.obligado === 1 || ronda.obligado === 2 || ronda.obligado === 3) {
  //     setRonda ({
  //       ...ronda,
  //       typeRound: 'apuesta',
  //       ApuestaTotal: 0,
  //       obligado: ronda.obligado + 1,
  //       CardGanadoraxRonda: [{valor: null, palo: '', id: ''}],
  //       cantQueApostaron: 0,
  //     });
  //   } else {
  //     setRonda ({
  //       ...ronda,
  //       typeRound: 'apuesta',
  //       ApuestaTotal: 0,
  //       obligado: 1,
  //       CardGanadoraxRonda: [{valor: null, palo: '', id: ''}],
  //       cantQueApostaron: 0,
  //     });
  //   }
  // };

  // const GuardarEnBase = () => {
  //   if (ronda.cardPorRonda === 1) {
  //     setBase ([
  //       ...Base,
  //       {
  //         ronda: {
  //           vuelta: ronda.vuelta - 1,
  //           cards: 7,
  //         },

  //         jugador1: {
  //           puntos: jugador1.puntos,
  //           cumplio: jugador1.cumplio,
  //           apostadas: jugador1.apuestaP,
  //         },
  //         jugador2: {
  //           puntos: jugador2.puntos,
  //           cumplio: jugador2.cumplio,
  //           apostadas: jugador2.apuestaP,
  //         },
  //         jugador3: {
  //           puntos: jugador3.puntos,
  //           cumplio: jugador3.cumplio,
  //           apostadas: jugador3.apuestaP,
  //         },
  //         jugador4: {
  //           puntos: jugador4.puntos,
  //           cumplio: jugador4.cumplio,
  //           apostadas: jugador4.apuestaP,
  //         },
  //       },
  //     ]);
  //   } else {
  //     setBase ([
  //       ...Base,
  //       {
  //         ronda: {
  //           vuelta: ronda.vuelta - 1,
  //           cards: ronda.cardPorRonda - 2,
  //         },

  //         jugador1: {
  //           puntos: jugador1.puntos,
  //           cumplio: jugador1.cumplio,
  //           apostadas: jugador1.apuestaP,
  //         },
  //         jugador2: {
  //           puntos: jugador2.puntos,
  //           cumplio: jugador2.cumplio,
  //           apostadas: jugador2.apuestaP,
  //         },
  //         jugador3: {
  //           puntos: jugador3.puntos,
  //           cumplio: jugador3.cumplio,
  //           apostadas: jugador3.apuestaP,
  //         },
  //         jugador4: {
  //           puntos: jugador4.puntos,
  //           cumplio: jugador4.cumplio,
  //           apostadas: jugador4.apuestaP,
  //         },
  //       },
  //     ]);
  //   }
  //   // }
  // };
  //setear el name depende la position
  // `jugador${i + 1}`

  useEffect (() => {
  
    socket.on ('start_game', data => {
      let roomId = data[0].roomId;
      setLoader (!loader);
      // distribute (game, roomId, data, setPlayers, players, round, setRound);
    });
  }, []);

  // GuardarEnBase ();

  // useEffect (
  //   () => {
  //     turno (
  //       ronda,
  //       jugador1,
  //       jugador2,
  //       jugador3,
  //       jugador4,
  //       setJugador1,
  //       setJugador2,
  //       setJugador3,
  //       setJugador4
  //     );
  //   },
  //   [ronda.turnoJugadorR, ronda.vuelta, ronda.typeRound]
  // );

  // useEffect (
  //   () => {
  //     if (ronda.typeRound === 'ronda')
  //       AsignarMayor (
  //         ronda.ultimaCardApostada[0],
  //         ronda.AnteultimaCardApostada[0],
  //         ronda,
  //         setRonda
  //       );
  //     turno (
  //       ronda,
  //       jugador1,
  //       jugador2,
  //       jugador3,
  //       jugador4,
  //       setJugador1,
  //       setJugador2,
  //       setJugador3,
  //       setJugador4
  //     );
  //   },
  //   [ronda.cantQueTiraron, ronda.typeRound, ronda.numeroRonda]
  // );

  // useEffect (
  //   () => {
  //     if (ronda.cantQueTiraron === 4) {
  //       cambioRonda ();
  //       SumarGanada ();
  //     }
  //   },
  //   [jugador1.myturnR, jugador2.myturnR, jugador3.myturnR, jugador4.myturnR]
  // );

  // useEffect (
  //   () => {
  //     if (ronda.numeroRonda > 1) {
  //       setTurnoRound ();
  //       cambioDeVuelta ();
  //     }
  //     turno (
  //       ronda,
  //       jugador1,
  //       jugador2,
  //       jugador3,
  //       jugador4,
  //       setJugador1,
  //       setJugador2,
  //       setJugador3,
  //       setJugador4
  //     );
  //   },
  //   [ronda.numeroRonda]
  // );

  // useEffect (
  //   () => {
  //     if (ronda.vuelta >= 1) {
  //       Cumplio ();
  //     }
  //   },
  //   [ronda.vuelta]
  // );

  // useEffect (
  //   () => {
  //     if (ronda.vuelta > 1) {
  //       puntos ();
  //     }
  //   },
  //   [jugador1.cumplio, jugador2.cumplio, jugador3.cumplio, jugador4.cumplio]
  // );

  // useEffect (
  //   () => {
  //     if (ronda.vuelta > 1) {
  //       setTimeout (() => {
  //         GuardarEnBase ();
  //         resetPlayers ();
  //         resetRound ();
  //       }, 1000);
  //     }
  //     turno (
  //       ronda,
  //       jugador1,
  //       jugador2,
  //       jugador3,
  //       jugador4,
  //       setJugador1,
  //       setJugador2,
  //       setJugador3,
  //       setJugador4
  //     );
  //   },
  //   [jugador1.puntos, jugador2.puntos, jugador3.puntos, jugador4.puntos]
  // );

  // useEffect (
  //   () => {
  //     if (ronda.vuelta > 1) {
  //       if (ronda.typeRound === 'apuesta') {
  //         distribute (
  //           setJugador1,
  //           jugador1,
  //           setJugador2,
  //           jugador2,
  //           setJugador3,
  //           jugador3,
  //           setJugador4,
  //           jugador4,
  //           ronda
  //         );
  //       }
  //     }
  //   },
  //   [ronda.typeRound]
  // );

  const renderPlayerCards = player => {
    return player.cardPerson.map ((card, index) => (
      <Cards
        key={index}
        value={card.value}
        palo={card.palo}
        jugador={player}
        setJugador={'setJugador1'} // Esto puede variar dependiendo del jugador
        setRonda={setRound}
        ronda={round}
      />
    ));
  };

  return (
    <div className={style.contain}>

      {loader == true
        ? <Loader game={game}/>
        : <div className={style.tableroJugadores}>

            {/* <div className={style.jugador2}>
              <Jugadores
                jugador={jugador3}
                setJugador={setJugador3}
                setRonda={setRonda}
                ronda={ronda}
              />
            </div>
            <div className={style.jugador3}>
              <Jugadores
                jugador={jugador3}
                setJugador={setJugador3}
                setRonda={setRonda}
                ronda={ronda}
              />
            </div>
            <div className={style.jugador4}>
              <Jugadores
                jugador={jugador4}
                setJugador={setJugador4}
                setRonda={setRonda}
                ronda={ronda}
              />
            </div>
            <div className={style.jugador5}>
              <Jugadores
                jugador={jugador4}
                setJugador={setJugador4}
                setRonda={setRonda}
                ronda={ronda}
              />
            </div>
            <div className={style.jugador6}>
              <Jugadores
                jugador={jugador4}
                setJugador={setJugador4}
                setRonda={setRonda}
                ronda={ronda}
              />
            </div> */}

          </div>}
      <div />
      {/* cartas en el centro de la pantalla */}
      {/* <div className={style.CardPropias}>
        {roomIdberenjena.positionId === 1
          ? renderPlayerCards (jugador1)
          : roomIdberenjena.positionId === 2
              ? renderPlayerCards (jugador2)
              : roomIdberenjena.positionId === 3
                  ? renderPlayerCards (jugador3)
                  : roomIdberenjena.positionId === 4
                      ? renderPlayerCards (jugador4)
                      : roomIdberenjena.positionId === 5
                          ? renderPlayerCards (jugador5)
                          : roomIdberenjena.positionId === 6
                              ? renderPlayerCards (jugador6)
                              : ''}
      </div> */}
      {/* cartas en el centro de la pantalla */}

      {/* <div className={style.CardPropiasApost}>
        {jugador1.cardApostada[0].valor &&
          jugador1.cardApostada.map ((card, index) => (
            <Cards
              key={index}
              valor={card.valor}
              palo={card.palo}
              jugador={jugador1}
            />
          ))}
      </div> */}

      {/* <DataPlayer
        jugador={
          roomIdberenjena.positionId === 1 && jugador1
            ? jugador1
            : roomIdberenjena.positionId === 2 && jugador2
                ? jugador2
                : roomIdberenjena.positionId === 3 && jugador3
                    ? jugador3
                    : roomIdberenjena.positionId === 4 && jugador4
                        ? jugador4
                        : roomIdberenjena.positionId === 5 && jugador5
                            ? jugador5
                            : roomIdberenjena.positionId === 6 && jugador6
                                ? jugador6
                                : ''
        }
      /> */}

      <DataGame ronda={round} />
      {showResult === true
        ? <Result Base={Base} setShowResult={setShowResult} />
        : ''}
      <ButtonExitRoom />

      {/* {ronda.typeRound === 'apuesta'
        ? <Apuesta
            jugador1={jugador1}
            setJugador1={setJugador1}
            jugador2={jugador2}
            setJugador2={setJugador2}
            jugador3={jugador3}
            setJugador3={setJugador3}
            jugador4={jugador4}
            setJugador4={setJugador4}
            ronda={ronda}
            setRonda={setRonda}
          />
        : ''} */}

      <div className={style.resultado} onClick={() => setShowResult (true)}>
        <p>Resultados</p>
      </div>
    </div>
  );
};
export default GameBerenjena;

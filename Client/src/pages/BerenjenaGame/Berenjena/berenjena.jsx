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
  generarObligado,
  turno,
} from '../../../functions/logica/logica.js';

import Apuesta from '../../../components/berenjena/apuesta/apuesta';
import ButtonExitRoom
  from '../../../components/berenjena/buttonExitRoom/buttonExitRoom.jsx';
import {socket} from '../../../functions/SocketIO/sockets/sockets';
import {useParams} from 'react-router-dom';
const GameBerenjena = () => {
  const [loader, setLoader] = useState (true);
  const [game, setGame] = useState ('Berenjena'); // Juego seleccionado
  const [showResult, setShowResult] = useState (false);
  const [myPosition, setMyPosition] = useState (1);

  const [players, setPlayers] = useState ([]);

  const [round, setRound] = useState ({
    users: null, //usuarios conectados
    vuelta: 1, //num de vuelta (4 rondas =1 vuelta)
    numRound: 1, //num de ronda
    cardXRound: 1, //cant de cartas que se reparten
    typeRound: '', //apuesta o ronda
    turnJugadorA: 1, //1j 2j 3j 4j apuesta
    turnJugadorR: 1, //1j 2j 3j 4j ronda
    obligado: null, //numero de jugador obligado
    betTotal: 0, //suma de la apuesta de todos
    cardWinxRound: [{value: null, suit: '', id: ''}], //card ganada en la ronda
    lastCardBet: [{value: null, suit: '', id: ''}], //ultima card apostada
    beforeLastCardBet: [{value: null, suit: '', id: ''}], //anteultima card apostada
    ganadorRonda: null,
    cantQueApostaron: 0,
    cantQueTiraron: 0,
    roomId: null,
    timer: '',
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

  const {id} = useParams ();

  useEffect (
    () => {
      const handleStartGame = data => {
        setLoader (prevLoader => !prevLoader);
        setRound ({
          ...round,
          typeRound: 'Bet',
          turnJugadorA: data.nextTurn + 1,
          obligado: data.userObligado + 1,
          roomId: data.room,
          users: data.cantUser,
        });
        // Reseteamos la distribución de cartas para la nueva ronda
      };

      socket.on ('start_game', handleStartGame);

      return () => {
        socket.off ('start_game', handleStartGame);
      };
    },
    [id, game]
  );

  useEffect (
    () => {
      if (round.typeRound === 'Bet' ) {
        let roomId = id;
        distribute (game, round, roomId, setPlayers, players);
        // Marcar que las cartas han sido distribuidas
      }
    },
    [round ]
  );

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
    if (player) {
      return player.cardPerson.map ((card, index) => (
        <Cards
          key={index}
          value={card.value}
          suit={card.suit}
          players={players}
          setPlayers={setPlayers} // Esto puede variar dependiendo del jugador
          setRound={setRound}
          round={round}
        />
      ));
    }
  };
  // console.log(players);
  return (
    <div className={style.contain}>

      {loader == true
        ? <Loader
            game={game}
            setMyPosition={setMyPosition}
            players={players}
            setPlayers={setPlayers}
            round={round}
            setRound={setRound}
          />
        : <div className={style.tableroJugadores}>

            <div className={style.jugador2}>
              <Jugadores
                player={players[1]}
                setPlayers={setPlayers}
                setRound={setRound}
                round={round}
              />
            </div>
            <div className={style.jugador3}>
              <Jugadores
                player={players[1]}
                setPlayerss={setPlayers}
                setRound={setRound}
                round={round}
              />
            </div>
            <div className={style.jugador4}>
              <Jugadores
                player={players[1]}
                setPlayers={setPlayers}
                setRound={setRound}
                round={round}
              />
            </div>
            <div className={style.jugador5}>
              <Jugadores
                player={players[1]}
                setPlayers={setPlayers}
                setRound={setRound}
                round={round}
              />
            </div>
            <div className={style.jugador6}>
              <Jugadores
                player={players[1]}
                setPlayers={setPlayers}
                setRound={setRound}
                round={round}
              />
            </div>

          </div>}
      <div />
      {/* cartas en el centro de la pantalla */}
      <div className={style.CardPropias}>
        {myPosition === 1
          ? renderPlayerCards (players[0])
          : myPosition === 2
              ? renderPlayerCards (players[1])
              : myPosition === 3
                  ? renderPlayerCards (players[2])
                  : myPosition === 4
                      ? renderPlayerCards (players[3])
                      : myPosition === 5
                          ? renderPlayerCards (players[4])
                          : myPosition === 6
                              ? renderPlayerCards (players[5])
                              : ''}
      </div>
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

      <DataPlayer
        player={
          myPosition === 1
            ? players[0]
            : myPosition === 2
                ? players[1]
                : myPosition === 3
                    ? players[2]
                    : myPosition === 4
                        ? players[3]
                        : myPosition === 5
                            ? players[4]
                            : myPosition === 6 ? players[5] : null
        }
      />

      {round.typeRound === 'Bet'
        ? <Apuesta
            players={players}
            setPlayers={setPlayers}
            round={round}
            roomId={id}
            setRound={setRound}
            myPosition={myPosition}
            game={game}
          />
        : ''}
       {/* <Result Base={Base} setShowResult={setShowResult} /> */}

      <DataGame round={round} />
      {showResult === true?""
        : ''}
      <ButtonExitRoom />

      <div className={style.resultado} onClick={() => setShowResult (true)}>
        <p>Resultados</p>
      </div>
    </div>
  );
};
export default GameBerenjena;

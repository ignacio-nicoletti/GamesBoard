import {useEffect, useState} from 'react';
import style from './berenjena.module.css';
import {WriteName} from '../../../components/berenjena/writeName/writeName';
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
  mezclar,
  turno,
} from '../../../functions/logica/logica.js';
import {
  connectSocket,
  disconnectRoom,
} from '../../../functions/SocketIO/sockets/sockets';
import {Link} from 'react-router-dom';
import Apuesta from '../../../components/berenjena/apuesta/apuesta';

const GameBerenjena = () => {
  const [writeName, setWriteName] = useState (true);
  const [loader, setLoader] = useState (true);

  const [activo, setActivo] = useState (false); //modal del resultado
  const [Base, setBase] = useState ([]); //base del resultado xronda
  const [myPosition, setMyPosition] = useState (null); //base del resultado xronda
  const [sala, setSala] = useState ([]); //base del resultado xronda

  const [votacion, setVotacion] = useState ([]); //base del resultado xronda

  const [jugador1, setJugador1] = useState ({
    username: '',
    id: 1,
    cardPersona: [],
    apuestaP: null,
    cardsganadas: 0,
    cardApostada: [{valor: null, palo: ''}],
    myturnA: false, //boolean
    myturnR: false, //boolean
    cumplio: false, //boolean
    puntos: 0,
  });

  const [jugador2, setJugador2] = useState ({
    username: '',
    id: 2,
    cardPersona: [],
    apuestaP: null,
    cardsganadas: 0,
    cardApostada: [{valor: null, palo: ''}],
    myturnA: false, //boolean
    myturnR: false, //booleanA
    cumplio: false, //boolean
    puntos: 0,
  });

  const [jugador3, setJugador3] = useState ({
    username: '',
    id: 3,
    cardPersona: [],
    apuestaP: null,
    cardsganadas: 0,
    cardApostada: [{valor: null, palo: ''}],
    myturnA: false, //boolean
    myturnR: false, //boolean
    cumplio: false, //boolean
    puntos: 0,
  });

  const [jugador4, setJugador4] = useState ({
    username: '',
    id: 4,
    cardPersona: [],
    apuestaP: null,
    cardsganadas: 0,
    cardApostada: [{valor: null, palo: ''}],
    myturnA: false, //boolean
    myturnR: false, //boolean
    cumplio: false, //boolean
    puntos: 0,
  });

  const [ronda, setRonda] = useState ({
    cantUser: 4, //usuarios conectados
    vuelta: 1, //num de vuelta (4 rondas =1 vuelta)
    numeroRonda: 1, //num de ronda
    cardPorRonda: 7, //cant de cartas que se reparten
    typeRound: '', //apuesta o ronda
    turnoJugadorA: 1, //1j 2j 3j 4j apuesta
    turnoJugadorR: 1, //1j 2j 3j 4j ronda
    obligado: null, //numero de jugador obligado
    ApuestaTotal: 0, //suma de la apuesta de todos
    CardGanadoraxRonda: [{valor: null, palo: '', id: ''}],
    ultimaCardApostada: [{valor: null, palo: '', id: ''}],
    AnteultimaCardApostada: [{valor: null, palo: '', id: ''}],
    ganadorRonda: null,
    cantQueTiraron: 0,
  });

  const setTurnoRound = () => {
    let turno = ronda.CardGanadoraxRonda[0].id;

    switch (turno) {
      case 1:
        setRonda ({
          ...ronda,
          turnoJugadorR: 1,
        });
        break;
      case 2:
        setRonda ({
          ...ronda,
          turnoJugadorR: 2,
        });

        break;
      case 3:
        setRonda ({
          ...ronda,
          turnoJugadorR: 3,
        });
        break;
      case 4:
        setRonda ({
          ...ronda,
          turnoJugadorR: 4,
        });
        break;

      default:
        break;
    }
  };

  const cambioDeVuelta = () => {
    if (ronda.cardPorRonda === 1 && ronda.numeroRonda === 2) {
      setRonda ({
        ...ronda,
        vuelta: ronda.vuelta + 1,
        cantQueApostaron: 0,
        cantQueTiraron: 0,
        numeroRonda: 1,
        cardPorRonda: ronda.cardPorRonda + 2,
      });
    }
    if (ronda.cardPorRonda === 3 && ronda.numeroRonda === 4) {
      setRonda ({
        ...ronda,
        vuelta: ronda.vuelta + 1,
        cantQueApostaron: 0,
        cantQueTiraron: 0,
        numeroRonda: 1,
        cardPorRonda: ronda.cardPorRonda + 2,
      });
    }
    if (ronda.cardPorRonda === 5 && ronda.numeroRonda === 6) {
      setRonda ({
        ...ronda,
        vuelta: ronda.vuelta + 1,
        cantQueApostaron: 0,
        cantQueTiraron: 0,
        numeroRonda: 1,
        cardPorRonda: ronda.cardPorRonda + 2,
      });
    }
    if (ronda.cardPorRonda === 7 && ronda.numeroRonda === 8) {
      setRonda ({
        ...ronda,
        cardPorRonda: 1,
        vuelta: ronda.vuelta + 1,
        cantQueApostaron: 0,
        cantQueTiraron: 0,
        numeroRonda: 1,
      });
    }
  };

  const cambioRonda = () => {
    setRonda ({
      ...ronda,
      turnoJugadorR: ronda.CardGanadoraxRonda[0].id,
      cantQueTiraron: 0,
      numeroRonda: ronda.numeroRonda + 1,
      ultimaCardApostada: [{valor: '', palo: '', id: ''}],
      CardGanadoraxRonda: [{valor: '', palo: '', id: ''}],
    });
  };

  const Cumplio = () => {
    if (jugador1.apuestaP === jugador1.cardsganadas) {
      setJugador1 ({...jugador1, cumplio: true});
    }
    if (jugador2.apuestaP === jugador2.cardsganadas) {
      setJugador2 ({...jugador2, cumplio: true});
    }
    if (jugador3.apuestaP === jugador3.cardsganadas) {
      setJugador3 ({...jugador3, cumplio: true});
    }
    if (jugador4.apuestaP === jugador4.cardsganadas) {
      setJugador4 ({...jugador4, cumplio: true});
    }
  };

  const puntos = () => {
    if (jugador1.cumplio === true) {
      setJugador1 ({
        ...jugador1,
        puntos: jugador1.puntos + 5 + jugador1.cardsganadas,
      });
    } else {
      setJugador1 ({...jugador1, puntos: jugador1.puntos});
    }

    if (jugador2.cumplio === true) {
      setJugador2 ({
        ...jugador2,
        puntos: jugador2.puntos + 5 + jugador2.cardsganadas,
      });
    } else {
      setJugador2 ({...jugador2, puntos: jugador2.puntos});
    }

    if (jugador3.cumplio === true) {
      setJugador3 ({
        ...jugador3,
        puntos: jugador3.puntos + 5 + jugador3.cardsganadas,
      });
    } else {
      setJugador3 ({...jugador3, puntos: jugador3.puntos});
    }

    if (jugador4.cumplio === true) {
      setJugador4 ({
        ...jugador4,
        puntos: jugador4.puntos + 5 + jugador4.cardsganadas,
      });
    } else {
      setJugador4 ({...jugador4, puntos: jugador4.puntos});
    }
  };

  const SumarGanada = () => {
    switch (ronda.CardGanadoraxRonda[0].id) {
      case 1:
        setJugador1 ({...jugador1, cardsganadas: jugador1.cardsganadas + 1});
        break;
      case 2:
        setJugador2 ({...jugador2, cardsganadas: jugador2.cardsganadas + 1});
        break;
      case 3:
        setJugador3 ({...jugador3, cardsganadas: jugador3.cardsganadas + 1});
        break;
      case 4:
        setJugador4 ({...jugador4, cardsganadas: jugador4.cardsganadas + 1});
        break;

      default:
        break;
    }
  };

  const resetPlayers = () => {
    setJugador1 ({
      ...jugador1,
      cardApostada: [{valor: null, palo: ''}],
      apuestaP: null,
      cumplio: false,
      cardsganadas: 0,
    });
    setJugador2 ({
      ...jugador2,
      cardApostada: [{valor: null, palo: ''}],
      apuestaP: null,
      cumplio: false,
      cardsganadas: 0,
    });
    setJugador3 ({
      ...jugador3,
      cardApostada: [{valor: null, palo: ''}],
      apuestaP: null,
      cumplio: false,
      cardsganadas: 0,
    });
    setJugador4 ({
      ...jugador4,
      cardApostada: [{valor: null, palo: ''}],
      apuestaP: null,
      cumplio: false,
      cardsganadas: 0,
    });
  };

  const resetRound = () => {
    if (ronda.obligado === 1 || ronda.obligado === 2 || ronda.obligado === 3) {
      setRonda ({
        ...ronda,
        typeRound: 'apuesta',
        ApuestaTotal: 0,
        obligado: ronda.obligado + 1,
        CardGanadoraxRonda: [{valor: null, palo: '', id: ''}],
        cantQueApostaron: 0,
      });
    } else {
      setRonda ({
        ...ronda,
        typeRound: 'apuesta',
        ApuestaTotal: 0,
        obligado: 1,
        CardGanadoraxRonda: [{valor: null, palo: '', id: ''}],
        cantQueApostaron: 0,
      });
    }
  };

  const GuardarEnBase = () => {
    if (ronda.cardPorRonda === 1) {
      setBase ([
        ...Base,
        {
          ronda: {
            vuelta: ronda.vuelta - 1,
            cards: 7,
          },

          jugador1: {
            puntos: jugador1.puntos,
            cumplio: jugador1.cumplio,
            apostadas: jugador1.apuestaP,
          },
          jugador2: {
            puntos: jugador2.puntos,
            cumplio: jugador2.cumplio,
            apostadas: jugador2.apuestaP,
          },
          jugador3: {
            puntos: jugador3.puntos,
            cumplio: jugador3.cumplio,
            apostadas: jugador3.apuestaP,
          },
          jugador4: {
            puntos: jugador4.puntos,
            cumplio: jugador4.cumplio,
            apostadas: jugador4.apuestaP,
          },
        },
      ]);
    } else {
      setBase ([
        ...Base,
        {
          ronda: {
            vuelta: ronda.vuelta - 1,
            cards: ronda.cardPorRonda - 2,
          },

          jugador1: {
            puntos: jugador1.puntos,
            cumplio: jugador1.cumplio,
            apostadas: jugador1.apuestaP,
          },
          jugador2: {
            puntos: jugador2.puntos,
            cumplio: jugador2.cumplio,
            apostadas: jugador2.apuestaP,
          },
          jugador3: {
            puntos: jugador3.puntos,
            cumplio: jugador3.cumplio,
            apostadas: jugador3.apuestaP,
          },
          jugador4: {
            puntos: jugador4.puntos,
            cumplio: jugador4.cumplio,
            apostadas: jugador4.apuestaP,
          },
        },
      ]);
    }
    // }
  };

  useEffect (() => {
    connectSocket ();
  }, []);

  useEffect (
    () => {
      if (sala.length === 1) {
        setLoader (!loader);
        mezclar (
          setJugador1,
          jugador1,
          setJugador2,
          jugador2,
          setJugador3,
          jugador3,
          setJugador4,
          jugador4,
          ronda
        );
        if (ronda.vuelta === 1 && jugador1.username !== '') {
          setRonda ({...ronda, typeRound: 'apuesta', obligado: 4});
        }
      }
    },
    [sala]
  );

  useEffect (
    () => {
      turno (
        ronda,
        jugador1,
        jugador2,
        jugador3,
        jugador4,
        setJugador1,
        setJugador2,
        setJugador3,
        setJugador4
      );
    },
    [ronda.turnoJugadorR, ronda.vuelta, ronda.typeRound]
  );

  useEffect (
    () => {
      if (ronda.typeRound === 'ronda')
        AsignarMayor (
          ronda.ultimaCardApostada[0],
          ronda.AnteultimaCardApostada[0],
          ronda,
          setRonda
        );
      turno (
        ronda,
        jugador1,
        jugador2,
        jugador3,
        jugador4,
        setJugador1,
        setJugador2,
        setJugador3,
        setJugador4
      );
    },
    [ronda.cantQueTiraron, ronda.typeRound, ronda.numeroRonda]
  );

  useEffect (
    () => {
      if (ronda.cantQueTiraron === 4) {
        cambioRonda ();
        SumarGanada ();
      }
    },
    [jugador1.myturnR, jugador2.myturnR, jugador3.myturnR, jugador4.myturnR]
  );

  useEffect (
    () => {
      if (ronda.numeroRonda > 1) {
        setTurnoRound ();
        cambioDeVuelta ();
      }
      turno (
        ronda,
        jugador1,
        jugador2,
        jugador3,
        jugador4,
        setJugador1,
        setJugador2,
        setJugador3,
        setJugador4
      );
    },
    [ronda.numeroRonda]
  );

  useEffect (
    () => {
      if (ronda.vuelta >= 1) {
        Cumplio ();
      }
    },
    [ronda.vuelta]
  );

  useEffect (
    () => {
      if (ronda.vuelta > 1) {
        puntos ();
      }
    },
    [jugador1.cumplio, jugador2.cumplio, jugador3.cumplio, jugador4.cumplio]
  );

  useEffect (
    () => {
      if (ronda.vuelta > 1) {
        setTimeout (() => {
          GuardarEnBase ();
          resetPlayers ();
          resetRound ();
        }, 1000);
      }
      turno (
        ronda,
        jugador1,
        jugador2,
        jugador3,
        jugador4,
        setJugador1,
        setJugador2,
        setJugador3,
        setJugador4
      );
    },
    [jugador1.puntos, jugador2.puntos, jugador3.puntos, jugador4.puntos]
  );

  useEffect (
    () => {
      if (ronda.vuelta > 1) {
        if (ronda.typeRound === 'apuesta') {
          mezclar (
            setJugador1,
            jugador1,
            setJugador2,
            jugador2,
            setJugador3,
            jugador3,
            setJugador4,
            jugador4,
            ronda
          );
        }
      }
    },
    [ronda.typeRound]
  );

  const renderPlayerCards = player => {
    return player.cardPersona.map ((card, index) => (
      <Cards
        key={index}
        valor={card.valor}
        palo={card.palo}
        jugador={player}
        setJugador={setJugador1} // Esto puede variar dependiendo del jugador
        setRonda={setRonda}
        ronda={ronda}
      />
    ));
  };

  return (
    <div className={style.contain}>
      {writeName === true
        ? <WriteName
            setWriteName={setWriteName}
            setJugador1={setJugador1}
            jugador1={jugador1}
            setJugador2={setJugador2}
            jugador2={jugador2}
            setJugador3={setJugador3}
            jugador3={jugador3}
            setJugador4={setJugador4}
            jugador4={jugador4}
            setMyPosition={setMyPosition}
            setSala={setSala}
          />
        : <div>
            {loader == true
              ? <Loader />
              : ronda.cantUser === 4
                  ? <div className={style.jugadorestres}>

                      {/* <div className={style.jugador2}>
                        <Jugadores
                          jugador={
                            myPosition === 1
                              ? jugador2
                              : myPosition === 2
                                  ? jugador3
                                  : myPosition === 3
                                      ? jugador4
                                      : myPosition === 4 ? jugador1 : ''
                          }
                          setJugador={setJugador2}
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
                      </div> */}
                    </div>
                  : <div className={style.jugadoresdos}>
                      {/* <div>
                        <Jugadores jugador={jugador2} />
                      </div>
                      <div>
                        <Jugadores jugador={jugador3} />
                      </div> */}
                    </div>}
            <div />
            {/* cartas en el centro de la pantalla */}
            <div className={style.CardPropias}>
              {myPosition === 1
                ? renderPlayerCards (jugador1)
                : myPosition === 2
                    ? renderPlayerCards (jugador2)
                    : myPosition === 3
                        ? renderPlayerCards (jugador3)
                        : myPosition === 4 ? renderPlayerCards (jugador4) : ''}
            </div>
            {/* cartas en el centro de la pantalla */}

            <div className={style.CardPropiasApost}>
              {jugador1.cardApostada[0].valor &&
                jugador1.cardApostada.map ((card, index) => (
                  <Cards
                    key={index}
                    valor={card.valor}
                    palo={card.palo}
                    jugador={jugador1}
                  />
                ))}
            </div>

            {/* <DataGame ronda={ronda} /> */}
            <DataPlayer
              jugador={
                myPosition === 1
                  ? jugador1
                  : myPosition === 2
                      ? jugador2
                      : myPosition === 3
                          ? jugador3
                          : myPosition === 4 ? jugador4 : ''
              }
              ronda={ronda}
              myPosition={myPosition}
            />

            {ronda.typeRound === 'apuesta'
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
              : ''}

            <div
              onClick={() => setActivo (!activo)}
              className={style.buttonResult}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-award-filled"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path
                  d="M19.496 13.983l1.966 3.406a1.001 1.001 0 0 1 -.705 1.488l-.113 .011l-.112 -.001l-2.933 -.19l-1.303 2.636a1.001 1.001 0 0 1 -1.608 .26l-.082 -.094l-.072 -.11l-1.968 -3.407a8.994 8.994 0 0 0 6.93 -3.999z"
                  stroke-width="0"
                  fill="orange"
                />
                <path
                  d="M11.43 17.982l-1.966 3.408a1.001 1.001 0 0 1 -1.622 .157l-.076 -.1l-.064 -.114l-1.304 -2.635l-2.931 .19a1.001 1.001 0 0 1 -1.022 -1.29l.04 -.107l.05 -.1l1.968 -3.409a8.994 8.994 0 0 0 6.927 4.001z"
                  stroke-width="0"
                  fill="orange"
                />
                <path
                  d="M12 2l.24 .004a7 7 0 0 1 6.76 6.996l-.003 .193l-.007 .192l-.018 .245l-.026 .242l-.024 .178a6.985 6.985 0 0 1 -.317 1.268l-.116 .308l-.153 .348a7.001 7.001 0 0 1 -12.688 -.028l-.13 -.297l-.052 -.133l-.08 -.217l-.095 -.294a6.96 6.96 0 0 1 -.093 -.344l-.06 -.271l-.049 -.271l-.02 -.139l-.039 -.323l-.024 -.365l-.006 -.292a7 7 0 0 1 6.76 -6.996l.24 -.004z"
                  stroke-width="0"
                  fill="orange"
                />
              </svg>
              <div>
                <Link
                  to="/berenjena"
                  className={style.link}
                  onClick={() => disconnectRoom ()}
                >

                  Salir{' '}
                </Link>
              </div>
            </div>

          </div>}

      {activo === true ? <Result Base={Base} /> : ''}
    </div>
  );
};
export default GameBerenjena;

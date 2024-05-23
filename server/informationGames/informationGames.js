export let Berenjena = {
  jugadores: [
    {
      username: "",
      id: "",
      position:null,
      cardPerson: [],
      betP: null,
      cardswins: 0,
      cardBet: [{ value: null, palo: "" }],
      myturnA: false, //boolean
      myturnR: false, //boolean
      cumplio: false, //boolean
      points: 0,
      ready: false,
    },
    {
      username: "",
      id: "",
      position:null,
      cardPerson: [],
      betP: null,
      cardswins: 0,
      cardBet: [{ value: null, palo: "" }],
      myturnA: false, //boolean
      myturnR: false, //boolean
      cumplio: false, //boolean
      points: 0,
      ready: false,
    },
    {
      username: "",
      id: "",
      position:null,
      cardPerson: [],
      betP: null,
      cardswins: 0,
      cardBet: [{ value: null, palo: "" }],
      myturnA: false, //boolean
      myturnR: false, //boolean
      cumplio: false, //boolean
      points: 0,
      ready: false,
    },
    {
      username: "",
      id: "",
      position:null,
      cardPerson: [],
      betP: null,
      cardswins: 0,
      cardBet: [{ value: null, palo: "" }],
      myturnA: false, //boolean
      myturnR: false, //boolean
      cumplio: false, //boolean
      points: 0,
      ready: false,
    },
    {
      username: "",
      id: "",
      position:null,
      cardPerson: [],
      betP: null,
      cardswins: 0,
      cardBet: [{ value: null, palo: "" }],
      myturnA: false, //boolean
      myturnR: false, //boolean
      cumplio: false, //boolean
      points: 0,
      ready: false,
    },
    {
      username: "",
      id: "",
      position:null,
      cardPerson: [],
      betP: null,
      cardswins: 0,
      cardBet: [{ value: null, palo: "" }],
      myturnA: false, //boolean
      myturnR: false, //boolean
      cumplio: false, //boolean
      points: 0,
      ready: false,
    },
  ],
  Game: {
    vuelta: 1, //num de vuelta (4 rondas =1 vuelta)
    numRound: 1, //num de ronda
    cardXRound: 1, //cant de cartas que se reparten
    typeRound: "", //apuesta o ronda
    turnJugadorA: 1, //1j 2j 3j 4j apuesta
    turnJugadorR: 1, //1j 2j 3j 4j ronda
    obligado: null, //numero de jugador obligado
    betTotal: 0, //suma de la apuesta de todos
    cardWinxRound: [{ value: null, palo: "", id: "" }], //card ganada en la ronda
    lastCardBet: [{ value: null, palo: "", id: "" }], //ultima card apostada
    beforeLastCardBet: [{ value: null, palo: "", id: "" }], //anteultima card apostada
    ganadorRonda: null,
    cantQueTiraron: 0,
    users: null, //usuarios conectados
    timer: null,
    roomId: null,
  },
  PointsOfGame: [],
};

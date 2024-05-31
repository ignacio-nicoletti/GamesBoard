import { useEffect, useState } from 'react';
import style from './berenjena.module.css';
import Jugadores from '../../../components/berenjena/jugadores/jugadores';
import Loader from '../../../components/berenjena/loader/loader';
import DataGame from '../../../components/berenjena/informationGame/dataGame/dataGame';
import DataPlayer from '../../../components/berenjena/informationGame/dataPlayer/dataPlayer';
import Result from '../../../components/berenjena/informationGame/Results/result';
import { distribute } from '../../../functions/logica/logica.js';
import Apuesta from '../../../components/berenjena/apuesta/apuesta';
import ButtonExitRoom from '../../../components/berenjena/buttonExitRoom/buttonExitRoom.jsx';
import { socket } from '../../../functions/SocketIO/sockets/sockets';
import MyCards from '../../../components/berenjena/myCards/myCards.jsx';

const GameBerenjena = () => {
  const [loader, setLoader] = useState(true);
  const [game, setGame] = useState('Berenjena'); // Juego seleccionado
  const [showResult, setShowResult] = useState(false);
  const [myPosition, setMyPosition] = useState(1);

  const [players, setPlayers] = useState([]);

  const [round, setRound] = useState({
    users: null, //usuarios conectados
    numRounds: 0, //num de ronda
    hands: 0, //igual a cant de cards repartidas
    cardXRound: 1, //cant de cartas que se reparten
    typeRound: '', //apuesta o ronda
    turnJugadorA: 1, //1j 2j 3j 4j apuesta
    turnJugadorR: 1, //1j 2j 3j 4j ronda
    obligado: null, //numero de jugador obligado
    betTotal: 0, //suma de la apuesta de todos
    cardWinxRound: {}, //card ganada en la ronda    {value: null, suit: '', id: ''}
    lastCardBet: {}, //ultima card apostada
    beforeLastCardBet: {}, //anteultima card apostada
    ganadorRonda: null,
    cantQueApostaron: 0,
    cantQueTiraron: 0,
    roomId: null,
    timer: '',
  });

  const [Base, setBase] = useState([]); //base del resultado xronda

  useEffect(() => {
    const handleStartGame = data => {
      setLoader(prevLoader => !prevLoader);
      setRound({
        ...round,
        typeRound: 'Bet',
        turnJugadorA: data.nextTurn + 1,
        obligado: data.userObligado + 1,
        roomId: {
          gameStarted: data.room.gameStarted,
          maxUsers: data.roomcantUser,
          roomId: data.roomId,
          game: data.game,
        },
        users: data.cantUser,
        vuelta: round.vuelta + 1,
      });
    };

    socket.on('start_game', handleStartGame);

    return () => {
      socket.off('start_game', handleStartGame);
    };
  }, []);

  useEffect(() => {
    if (round.typeRound === 'Bet') {
      distribute(round, setPlayers, players);
    }
  }, [round.typeRound]);

  const renderPlayers = () => {
    const positions = ['jugador2', 'jugador3', 'jugador4', 'jugador5', 'jugador6'];
    const filteredPlayers = players.filter((_, index) => index !== myPosition - 1);
    const reorderedPlayers = [...filteredPlayers.slice(myPosition - 1), ...filteredPlayers.slice(0, myPosition - 1)];

    return reorderedPlayers.slice(0, positions.length).map((player, index) => (
      <div className={style[positions[index]]} key={index}>
        <Jugadores player={player} />
      </div>
    ));
  };

  return (
    <div className={style.contain}>
      {loader ? (
        <Loader
          game={game}
          setMyPosition={setMyPosition}
          setPlayers={setPlayers}
        />
      ) : (
        <div className={style.tableroJugadores}>
          {renderPlayers()}
        </div>
      )}
      <MyCards
        myPosition={myPosition}
        players={players}
        setPlayers={setPlayers}
        setRound={setRound}
        round={round}
      />
      <DataPlayer myPosition={myPosition} players={players} />
      {round.typeRound === 'Bet' && (
        <Apuesta
          players={players}
          setPlayers={setPlayers}
          round={round}
          setRound={setRound}
          myPosition={myPosition}
        />
      )}
      <DataGame round={round} />
      {showResult && (
        <Result
          setShowResult={setShowResult}
          players={players}
          round={round}
        />
      )}
      <ButtonExitRoom />
      <div className={style.resultado} onClick={() => setShowResult(true)}>
        <p>Resultados</p>
      </div>
    </div>
  );
};
export default GameBerenjena;

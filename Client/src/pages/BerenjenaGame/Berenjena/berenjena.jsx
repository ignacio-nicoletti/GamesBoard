import {useEffect, useState} from 'react';
import style from './berenjena.module.css';
import Jugadores from '../../../components/berenjena/jugadores/jugadores';
import Loader from '../../../components/berenjena/loader/loader';
import DataGame
  from '../../../components/berenjena/informationGame/dataGame/dataGame';
import DataPlayer
  from '../../../components/berenjena/informationGame/dataPlayer/dataPlayer';
import Result
  from '../../../components/berenjena/informationGame/Results/result';
import Apuesta from '../../../components/berenjena/apuesta/apuesta';
import ButtonExitRoom
  from '../../../components/berenjena/buttonExitRoom/buttonExitRoom.jsx';
import {distribute, socket} from '../../../functions/SocketIO/sockets/sockets';
import MyCards from '../../../components/berenjena/myCards/myCards.jsx';
import BeetweenRound
  from '../../../components/berenjena/beetweenRound/beetweenRound';

const GameBerenjena = () => {
  const [loader, setLoader] = useState (true);
  const [game, setGame] = useState ('Berenjena'); // Juego seleccionado
  const [showResult, setShowResult] = useState (false);

  const [myPosition, setMyPosition] = useState (1);
  const [players, setPlayers] = useState ([]);
  const [round, setRound] = useState ({});
  const [results, setResults] = useState ([]); //base del resultado xronda

  const [timmerPlayer, setTimmerPlayer] = useState (30); //timmer para jugador
  const [timmerBetweenRound, setTimmerBetweenRound] = useState (5); //timmer entre rondas
  const [showBetweenRound, setShowBetweenRound] = useState (true);

  //timmer para tirar la carta entre jugadores
  useEffect (
    () => {
      setTimmerPlayer (30);
      const time = setInterval (() => {
        setTimmerPlayer (prevTime => prevTime - 1);
      }, 1000);
      return () => clearInterval (time);
    },
    [round]
  );

  //timmer entre rondas
  useEffect (
    () => {
      if (showBetweenRound) {
        setTimmerBetweenRound (5); // Inicias con el valor deseado
        const time = setInterval (() => {
          setTimmerBetweenRound (prevTime => {
            if (prevTime > 0) {
              return prevTime - 1;
            } else {
              clearInterval (time);
              setShowBetweenRound (false);
              return 0;
            }
          });
        }, 1000);
        return () => clearInterval (time);
      }
    },
    [showBetweenRound]
  );

  useEffect (() => {
    const handleStartGame = data => {
      setRound (data.round);
      setResults (data.results);
      setLoader (prevLoader => !prevLoader);
      setShowBetweenRound (true);
    };

    socket.on ('start_game', handleStartGame);
   

    return () => {
      socket.off ('start_game', handleStartGame);
    };
  }, []);

  useEffect (
    () => {
      if (round && round.typeRound === 'Bet') {
        distribute (round, setPlayers, players);
        setShowBetweenRound (true);
      }
    },
    [round.typeRound]
  );

  const renderPlayers = () => {
    const positions = [
      'jugador2',
      'jugador3',
      'jugador4',
      'jugador5',
      'jugador6',
    ];
    const filteredPlayers = players.filter (
      (_, index) => index !== myPosition - 1
    );
    const reorderedPlayers = [
      ...filteredPlayers.slice (myPosition - 1),
      ...filteredPlayers.slice (0, myPosition - 1),
    ];

    return reorderedPlayers
      .slice (0, positions.length)
      .map ((player, index) => (
        <div className={style[positions[index]]} key={index}>
          <Jugadores
            player={player}
            round={round}
            timmerPlayer={timmerPlayer}
          />
        </div>
      ));
  };

  return (
    <div className={style.contain}>
      {loader
        ? <Loader
            game={game}
            setMyPosition={setMyPosition}
            setPlayers={setPlayers}
            setRound={setRound}
          />
        : <div className={style.tableroJugadores}>{renderPlayers ()}</div>}

      {showBetweenRound === true
        ? <BeetweenRound timmerBetweenRound={timmerBetweenRound} />
        : ''}

      <MyCards
        myPosition={myPosition}
        players={players}
        setPlayers={setPlayers}
        setRound={setRound}
        round={round}
        setTimmerPlayer={setTimmerPlayer}
        timmerPlayer={timmerPlayer}
        results={results}
        setResults={setResults}
      />

      <DataPlayer
        myPosition={myPosition}
        players={players}
        timmerPlayer={timmerPlayer}
        round={round}
      />
      {round.typeRound === 'Bet' &&
        showBetweenRound === false &&
        timmerBetweenRound === 0 &&
        <Apuesta
          players={players}
          setPlayers={setPlayers}
          round={round}
          setRound={setRound}
          myPosition={myPosition}
          results={results}
          setResults={setResults}
          onApuestaEnd={() => setShowBetweenRound (true)}
        />}

      {showResult &&
        <Result
          setShowResult={setShowResult}
          players={players}
          round={round}
          results={results}
        />}
      <ButtonExitRoom game={game} />
      <div className={style.resultado} onClick={() => setShowResult (true)}>
        <p>Resultados</p>
      </div>
      <DataGame round={round} />
    </div>
  );
};
export default GameBerenjena;

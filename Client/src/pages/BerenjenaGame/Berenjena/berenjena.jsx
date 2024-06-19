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
import TimmerComponent
  from '../../../components/berenjena/timmerComponent/timmerComponent';

const GameBerenjena = () => {
  const [loader, setLoader] = useState (false);
  const [game] = useState ('Berenjena'); // Juego seleccionado
  const [showResult, setShowResult] = useState (false);

  const [myPlayer, setMyPlayer] = useState ({});
  const [players, setPlayers] = useState ([]);
  const [round, setRound] = useState ({});
  const [room, setRoom] = useState ({});
  const [results, setResults] = useState ([]); // base del resultado xronda

  const [showTimmer, setShowTimmer] = useState (false);
  const [timmerTicks, setTimmerTicks] = useState (null);
  const [timmerPlayer, setTimmerPlayer] = useState (30);

  //desconexion de jugador
  useEffect (
    () => {
      const updatePlayerList = data => {
        if (data && data.users) {
          setPlayers (data.users);
          setRound (data.round);
        }
      };
      socket.on ('roomRefresh', updatePlayerList);
      setLoader (true);
      return () => {
        socket.off ('roomRefresh', updatePlayerList);
      };
    },
    [game, setMyPlayer, setPlayers, setRound]
  );
  //desconexion de jugador

  //start-game
  useEffect (() => {
    const handleStartGame = data => {
      setRound (data.round); //establece typeRound en waiting
      setResults (data.results);
      setRoom (data.room);
      setLoader (false);
      setShowTimmer (true);
      setTimmerTicks (5);
    };
    socket.on ('start_game', handleStartGame);
    return () => {
      socket.off ('start_game', handleStartGame);
    };
  }, []);
  //start-game

  //timmer
  useEffect (() => {
    setTimmerPlayer (30);
    const time = setInterval (() => {
      setTimmerPlayer (prevTime => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          clearInterval (time);

          return 0;
        }
      });
    }, 1000);
    return () => clearInterval (time);
  }, []);
  //timmer

  useEffect (
    () => {
      if (round && round.typeRound === 'waiting') {
        console.log ('esperando jugadores');
      }
    },
    [round.typeRound]
  );
  
  //repartir cards
  useEffect (
    () => {
      if (round && round.typeRound === 'Bet') {
        distribute (round, setPlayers, players);
      }
    },
    [round.typeRound]
  );
  //repartir cards

  const renderPlayers = () => {
    const positions = [
      'jugador2',
      'jugador3',
      'jugador4',
      'jugador5',
      'jugador6',
    ];
    const filteredPlayers = players.filter (
      (_, index) => index !== myPlayer.position - 1
    );
    const reorderedPlayers = [
      ...filteredPlayers.slice (myPlayer.position - 1),
      ...filteredPlayers.slice (0, myPlayer.position - 1),
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
            setPlayers={setPlayers}
            setRound={setRound}
            myPlayer={myPlayer}
            setMyPlayer={setMyPlayer}
            setLoader={setLoader}
          />
        : <div className={style.tableroJugadores}>{renderPlayers ()}</div>}

      {round.typeRound === 'Bet' &&
        <Apuesta
          players={players}
          setPlayers={setPlayers}
          round={round}
          setRound={setRound}
          myPosition={myPlayer.position}
          results={results}
          setResults={setResults}
          onApuestaEnd={() => setShowTimmer (true)}
        />}

      {round.typeRound === 'waiting'
        ? <TimmerComponent
            type={round.typeRound}
            showTimmer={showTimmer}
            setShowTimmer={setShowTimmer}
            timmerTicks={timmerTicks}
            setRound={setRound}
            round={round}
          />
        : ''}

      <MyCards
        myPosition={myPlayer.position}
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
        myPosition={myPlayer.position}
        players={players}
        timmerPlayer={timmerPlayer}
        round={round}
      />

      {showResult &&
        <Result
          setShowResult={setShowResult}
          players={players}
          round={round}
          results={results}
        />}
      <ButtonExitRoom />

      <div className={style.resultado} onClick={() => setShowResult (true)}>
        <p>Resultados</p>
      </div>
      <DataGame round={round} />
    </div>
  );
};
export default GameBerenjena;

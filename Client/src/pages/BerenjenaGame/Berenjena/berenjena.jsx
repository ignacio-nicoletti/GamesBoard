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
  const [showResult, setShowResult] = useState (false);
  const [myPlayer, setMyPlayer] = useState ({});

  const [players, setPlayers] = useState ([]);
  const [round, setRound] = useState ({});
  const [dataRoom, setDataRoom] = useState ({});
  const [results, setResults] = useState ([]); // base del resultado xronda

  const [showTimmer, setShowTimmer] = useState (false);
  const [timmerTicks, setTimmerTicks] = useState (null);
  const [timmerPlayer, setTimmerPlayer] = useState (30);

  //start-game
  useEffect (() => {
    setLoader (true);
    const handleStartGame = data => {
      setRound (data.round); //establece typeRound en waiting
      setResults (data.results);
      setDataRoom (data.room);
      setPlayers(data.users)
      
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

  //repartir cards
  useEffect (
    () => {
      if (round && round.typeRound === 'Bet') {
        distribute (dataRoom, setPlayers);
      }
    },
    [round.typeRound]
  );
  //repartir cards

  //timmer
  useEffect (() => {
    if(round.typeRound==="ronda"){
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
  }
  }, [round.typeRound,round.turnJugadorR]);
  //timmer

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
            setPlayers={setPlayers}
            setRound={setRound}
            myPlayer={myPlayer}
            setMyPlayer={setMyPlayer}
            setLoader={setLoader}
            setDataRoom={setDataRoom}
            dataRoom={dataRoom}
          />
        : <div className={style.tableroJugadores}>{renderPlayers ()}</div>}

      {round.typeRound === 'Bet' &&
        <Apuesta
          setPlayers={setPlayers}
          round={round}
          setRound={setRound}
          myPosition={myPlayer.position}
          setResults={setResults}
          onApuestaEnd={() => setShowTimmer (true)}
          dataRoom={dataRoom}
        />}

      {dataRoom&&dataRoom.gameStarted && round.typeRound === 'waiting'
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
        setResults={setResults}
        dataRoom={dataRoom}
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

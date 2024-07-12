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
import WinnerComponent
  from '../../../components/berenjena/winnerComponent/winnerComponent';

const GameBerenjena = () => {
  const [loader, setLoader] = useState (false);
  const [showResult, setShowResult] = useState (false);
  const [myPlayer, setMyPlayer] = useState ({}); //mi position

  const [players, setPlayers] = useState ([]);
  const [round, setRound] = useState ({});
  const [dataRoom, setDataRoom] = useState ({});
  const [results, setResults] = useState ([]); // base del resultado xronda
  const [winner, setWinner] = useState ({}); // base del resultado xronda

  const [timmerPlayer, setTimmerPlayer] = useState (30);

  const [reorderedPlayers, setReorderedPlayers] = useState ([]); //distribucion de los jugadores

  //Start-game && Finish-Game
  useEffect (() => {
    if (!dataRoom.gameStarted) {
      setLoader (true);
    }
    const handleStartGame = data => {
      setRound (data.round); //establece typeRound en waiting
      setResults (data.results);
      setDataRoom (data.room);
      setPlayers (data.users);

      setLoader (false);
    };
    socket.on ('start_game', handleStartGame);

    socket.on ('GameFinish', data => {
      setRound (data.round);
      setPlayers (data.players);
      setResults (data.results);
      setWinner (data.winner);
    });
    return () => {
      socket.off ('start_game', handleStartGame);
    };
  }, []);
  //Start-game

  //Repartir cards
  useEffect (
    () => {
      if (round && round.typeRound === 'Bet') {
        distribute (dataRoom, setPlayers);
      }
    },
    [round.typeRound]
  );
  //Repartir cards

  //Timmer para tirar
  useEffect (
    () => {
      if (round.typeRound === 'ronda') {
        setTimmerPlayer (30);
        const time = setInterval (() => {
          setTimmerPlayer (prevTime => {
            if (prevTime > 0) {
              return prevTime - 1;
            } else if (prevTime === 0) {
              //  si el tiempo termina y el jugador se desconecto entonces que tire una carta random
              const playerFilter = players.filter (
                el => el.position === round.turnJugadorR
              );

              if (
                playerFilter.length > 0 &&
                playerFilter[0].connect === false
              ) {
                const cardPerson = playerFilter[0].cardPerson;

                if (cardPerson && cardPerson.length > 0) {
                  const randomCard =
                    cardPerson[Math.floor (Math.random () * cardPerson.length)];
                  const {value, suit} = randomCard;
                  socket.emit ('tirar_carta', {
                    myPosition: playerFilter[0].position,
                    value,
                    suit,
                    dataRoom,
                  });
                }
              }
            } else {
              clearInterval (time);
              return 0;
            }
          });
        }, 1000);
        return () => clearInterval (time);
      }
    },
    [round.typeRound, round.turnJugadorR]
  );
  //Timmer para tirar u apostar

  useEffect (() => {
    const handleRoomRefresh = data => {
      setRound (data.round);
      setPlayers (data.users);
      setResults (data.results);
    };
    socket.on ('roomRefresh', handleRoomRefresh);
    return () => {
      socket.off ('roomRefresh', handleRoomRefresh);
    };
  }, []);

  //Update cuando se elimina un jugador
  useEffect (
    () => {
      if (players.length > 0) {
        const updatedPlayer = players.find (
          el => el.userName === myPlayer.userName
        );
        if (updatedPlayer) {
          setMyPlayer (prevMyPlayer => ({
            ...prevMyPlayer,
            position: updatedPlayer.position,
          }));
        }
      }
    },
    [players.length]
  );
  //Update cuando se elimina un jugador

  //Actualiza las positions de los players
  useEffect (
    () => {
      const positions = [
        'jugador2',
        'jugador3',
        'jugador4',
        'jugador5',
        'jugador6',
      ];

      const filteredPlayers = players.filter (
        player => player.userName !== myPlayer.userName
      );

      const reordered = [
        ...filteredPlayers.slice (myPlayer.position - 1),
        ...filteredPlayers.slice (0, myPlayer.position - 1),
      ];

      setReorderedPlayers (reordered.slice (0, positions.length));
    },
    [players, myPlayer.position]
  );
  //Actualiza las positions de los players

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
        : <div className={style.tableroJugadores}>
            {reorderedPlayers &&
              reorderedPlayers.map ((player, index) => (
                <div
                  className={style[`jugador${index + 2}`]}
                  key={player.userName}
                >
                  <Jugadores
                    player={player}
                    round={round}
                    timmerPlayer={timmerPlayer}
                  />
                </div>
              ))}
          </div>}

      {dataRoom &&
        dataRoom.gameStarted &&
        round.typeRound === 'Bet' &&
        <Apuesta
          setPlayers={setPlayers}
          round={round}
          setRound={setRound}
          myPosition={myPlayer.position}
          setResults={setResults}
          dataRoom={dataRoom}
        />}

      {dataRoom &&
        dataRoom.gameStarted &&
        (round.typeRound === 'waiting' ||
          round.typeRound === 'waitingPlayers') &&
        <TimmerComponent
          setRound={setRound}
          round={round}
          players={players}
          results={results}
          dataRoom={dataRoom}
        />}

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

      <div className={style.resultado} onClick={() => setShowResult (true)}>
        <p>Score game</p>
      </div>

      {round.typeRound === 'EndGame' &&
        <WinnerComponent winner={winner} room={dataRoom} players={players} />}

      <ButtonExitRoom dataRoom={dataRoom} />

      <DataGame round={round} />
    </div>
  );
};
export default GameBerenjena;



// Logica => Si se desconecta y vuelve obtener los mismos datos de la partida que todos.

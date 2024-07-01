import React, {useEffect, useState} from 'react';
import style from './apuesta.module.css';
import {socket} from '../../../functions/SocketIO/sockets/sockets';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const Apuesta = ({
  setPlayers,
  round,
  setRound,
  myPosition,
  setResults,
  dataRoom,
}) => {
  const availableBets = () => {
    const availableBets = [...Array (round.cardXRound + 1)]
      .map ((_, index) => index)
      .filter (
        index =>
          !(myPosition === round.obligado &&
            index + round.betTotal === round.cardXRound)
      );

    const randomBet =
      availableBets[Math.floor (Math.random () * availableBets.length)];

    return randomBet;
  };

  const [bet, setBet] = useState (availableBets ());
  const [timeLeft, setTimeLeft] = useState (30);

  const handleSubmit = () => {
    socket.emit ('BetPlayer', {bet, myPosition, dataRoom});
  };

  //Si llega a 0 apuesta automatico
  useEffect (
    () => {
      if (timeLeft === 0) {
        setTimeLeft (30);
        socket.emit ('BetPlayer', {
          bet: availableBets (),
          myPosition,
          dataRoom,
        });
      }
    },
    [timeLeft]
  );
  //Si llega a 0 apuesta automatico

  useEffect (
    () => {
      socket.on ('update_game_state', data => {
        setTimeLeft (30);
        setRound (data.round);
        setPlayers (data.players);
        setResults (data.results);
      });

      return () => {
        socket.off ('update_game_state');
      };
    },
    [setRound, setPlayers, setResults]
  );

  const handleChange = event => {
    setBet (event.target.value);
  };

  //Timmer de la apuesta
  useEffect (
    () => {
      const timer = setInterval (() => {
        setTimeLeft (prevTime => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);

      return () => clearInterval (timer);
    },
    [setPlayers]
  );
   //Timmer de la apuesta

  const theme = createTheme ({
    typography: {
      fontFamily: 'Bebas Neue',
    },
    components: {
      MuiSelect: {
        styleOverrides: {
          root: {
            fontSize: '0.85rem',
            color: '#000',
            height: '2.5rem',
          },
          icon: {
            color: '#000',
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            fontSize: '0.85rem',
            color: '#000',
            '&.Mui-selected': {
              backgroundColor: '#0765bd',
              color: '#fff',
            },
            '&.Mui-selected:hover': {
              backgroundColor: '#0765bd',
            },
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div className={style.container}>
        {round.turnJugadorA === myPosition
          ? <div className={style.betContainer}>
              <div className={style.loader} />
              <p className={style.pTime}>{timeLeft} seconds left</p>
              <p>Jugador {round.turnJugadorA}</p>
              <FormControl sx={{m: 1, minWidth: 120}}>
                <InputLabel id="bet-select-label" />
                <Select
                  labelId="bet-select-label"
                  value={bet}
                  onChange={handleChange}
                  displayEmpty
                  inputProps={{'aria-label': 'Elige tu apuesta'}}
                >
                  <MenuItem value="" disabled>
                    <em>Elige tu apuesta</em>
                  </MenuItem>
                  {[...Array (round.cardXRound + 1)].map ((_, index) => (
                    <MenuItem
                      key={index}
                      value={index}
                      disabled={
                        myPosition === round.obligado &&
                          index + round.betTotal === round.cardXRound
                      }
                    >
                      {index} cartas
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <button onClick={handleSubmit}>Apostar</button>
            </div>
          : <div className={style.betContainer}>
              <div className={style.loader} />
              <p className={style.pTime}>{timeLeft} seconds left</p>
              <p>{round.turnJugadorA} apostando...</p>
            </div>}
      </div>
    </ThemeProvider>
  );
};

export default Apuesta;

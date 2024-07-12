import React, { useEffect, useState } from 'react';
import style from './apuesta.module.css';
import { socket } from '../../../functions/SocketIO/sockets/sockets';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { createTheme, ThemeProvider } from '@mui/material/styles';
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
  const getAvailableBets = () => {
    return [...Array(round.cardXRound + 1)]
      .map((_, index) => index)
      .filter(
        index =>
          !(myPosition === round.obligado &&
            index + round.betTotal === round.cardXRound)
      );
  };

  const [bet, setBet] = useState(getAvailableBets()[0]);
  const [timeLeft, setTimeLeft] = useState(30);

  const handleSubmit = (selectedBet = bet) => {
    socket.emit('BetPlayer', {
      bet: selectedBet,
      myPosition,
      dataRoom,
    });
    resetTimer();
  };

  const handleChange = event => {
    setBet(event.target.value);
  };

  const resetTimer = () => {
    setTimeLeft(30); // Reset timeLeft to 30 seconds
    const loader = document.querySelector(`.${style.loader}`);
    if (loader) {
      loader.style.animation = 'none';
      setTimeout(() => {
        loader.style.animation = '';
      }, 0);
    }
  };

  useEffect(() => {
    const handleGameStateUpdate = data => {
      setRound(data.round);
      setPlayers(data.players);
      setResults(data.results);
      resetTimer(); // Reset the timer and CSS animation when game state updates
    };

    socket.on('update_game_state', handleGameStateUpdate);
    setBet(getAvailableBets()[0]); // Ensure initial bet is valid

    return () => {
      socket.off('update_game_state', handleGameStateUpdate);
    };
  }, [round]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else if (prevTime === 0) {
          clearInterval(timer); // Clear the interval once the time is up
          const randomBet = getAvailableBets()[Math.floor(Math.random() * getAvailableBets().length)];
          handleSubmit(randomBet);
          return 0; // Reset the timer
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [round.turnJugadorA, myPosition]); // Depend on the player turn and myPosition

  const theme = createTheme({
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
      <div className={style.container} key={round.turnJugadorA}>
        {round.turnJugadorA === myPosition
          ? <div className={style.betContainer}>
              <div className={style.loader} />
              <p className={style.pTime}>{timeLeft} seconds left</p>
              <p>Player {round.turnJugadorA}</p>
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="bet-select-label" />
                <Select
                  labelId="bet-select-label"
                  value={bet}
                  onChange={handleChange}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Elige tu apuesta' }}
                >
                  <MenuItem value="" disabled>
                    <em>Choose your Bet</em>
                  </MenuItem>
                  {getAvailableBets().map(index => (
                    <MenuItem
                      key={index}
                      value={index}
                      disabled={
                        myPosition === round.obligado &&
                        index + round.betTotal === round.cardXRound
                      }
                    >
                      {index} card/s
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <button onClick={() => handleSubmit(bet)}>Bet</button>
            </div>
          : <div className={style.betContainer}>
              <div className={style.loader} />
              <p className={style.pTime}>{timeLeft} seconds left</p>
              <p>Player {round.turnJugadorA} betting...</p>
            </div>}
      </div>
    </ThemeProvider>
  );
};

export default Apuesta;

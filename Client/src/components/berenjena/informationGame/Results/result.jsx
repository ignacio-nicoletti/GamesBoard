import React from 'react';
import styles from './result.module.css';

const Result = ({ setShowResult, players, round, results }) => {
  const headers = [
    'Ronda',
    'Jugador',
    'Apuesta',
    'Cartas Ganadas',
    'Puntos',
    'Cumplió Apuesta'
  ];

  return (
    <div className={styles.ContainResult}>
      <div className={styles.closeResult}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ff904f"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="icon icon-tabler icon-tabler-circle-x"
          onClick={() => setShowResult(false)}
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
          <path d="M10 10l4 4m0 -4l-4 4" />
        </svg>
      </div>
      <div className={styles.table_component} role="region" tabIndex="0">
        <table>
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((result, roundIndex) => (
              result.players.map((player, playerIndex) => (
                <tr key={`${roundIndex}-${playerIndex}`}>
                  {playerIndex === 0 && (
                    <td rowSpan={result.players.length}>{result.numRounds}</td>
                  )}
                  <td>{player.userName}</td>
                  <td>{player.betP}</td>
                  <td>{player.cardsWins}</td>
                  <td>{player.points}</td>
                  <td>{player.cumplio ? 'Sí' : 'No'}</td>
                </tr>
              ))
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Result;

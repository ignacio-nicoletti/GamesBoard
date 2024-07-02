import React, {useEffect, useState} from 'react';
import styles from './result.module.css';
import {IoCloseCircleOutline} from 'react-icons/io5';

const Result = ({setShowResult, results}) => {
  const [listUsers, setListUsers] = useState ();

  useEffect (() => {
    if (results.length > 0) {
      setListUsers (results[0].players.map (player => player.userName));
    }
  }, [results]);

  return (
    <div className={styles.containResult}>
      <div className={styles.closeResult} onClick={() => setShowResult (false)}>
        <IoCloseCircleOutline size={48} color="#ff904f" />
      </div>
      <div className={styles.tableComponent} role="region" tabIndex="0">
        <table>
          <thead>
            <tr>
              <th>Ronda</th>
              {listUsers&&listUsers.map ((player, index) => (
                <th key={index} colSpan="2">
                  {player}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map ((result, roundIndex) => (
              <tr key={roundIndex}>
                <td>{roundIndex + 1}</td>
                {result.players.map ((player, playerIndex) => (
                  <React.Fragment key={playerIndex}>
                    <td className={styles.points}>{player.points}</td>
                    <td
                      className={`${styles.bet} ${player.cumplio ? styles.success : styles.fail}`}
                    >
                      {player.betP}
                    </td>
                  </React.Fragment>
                ))}
              </tr>
            ))}
            {/* <tr>
              <td>Total</td>
              {results[0].players.map ((player, playerIndex) => (
                <React.Fragment key={playerIndex}>
                  <td colSpan="2">{player.total}</td>
                </React.Fragment>
              ))}
            </tr> */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Result;

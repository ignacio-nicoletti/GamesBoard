import styles from './result.module.css';

const Result = ({ setShowResult, players, round,results}) => {
  const rows = 4;
  const columns = 7;
  const headers = [
    'Ronda',
    'aaaaaaaaaaaaaaa',
    'aaaaaaaaaaaaaaa',
    'aaaaaaaaaaaaaaa',
    'aaaaaaaaaaaaaaa',
    'aaaaaaaaaaaaaaa',
    'aaaaaaaaaaaaaaa',
  ];

  //ronda
  //nombre
  //position
  //nombre
  //nombre

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
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="icon icon-tabler icons-tabler-outline icon-tabler-circle-x"
          onClick={() => setShowResult (false)}
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
          <path d="M10 10l4 4m0 -4l-4 4" />
        </svg>
      </div>
      <div className={styles.table_component} role="region" tabIndex="0">
        <table>

          <thead>
            {/* <tr>
              {players&&players.map ((header, index) => <th key={index}>{header}</th>)}
            </tr> */}
          </thead>
          {/* <tbody>
            {Array.from ({length: rows}).map ((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from ({length: columns}).map ((_, colIndex) => (
                  <td key={colIndex} />
                ))}
              </tr>
            ))}
          </tbody> */}
        </table>

      </div>
    </div>
  );
};

export default Result;

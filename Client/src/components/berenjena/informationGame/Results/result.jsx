import style from './result.module.css';

const Result = ({Base}) => {
  const rows = 6;
  const columns = 7;
  console.log (Base);
  return (
    <div className={style.tableWrapper}>
      <table className={style.table}>
        <thead>
          <tr>
            <th>Ronda</th>
            <th>aaaaaaaaaaaaaaa</th>
            <th>aaaaaaaaaaaaaaa</th>
            <th>aaaaaaaaaaaaaaa</th>
            <th>aaaaaaaaaaaaaaa</th>
            <th>aaaaaaaaaaaaaaa</th>
            <th>aaaaaaaaaaaaaaa</th>

          </tr>
        </thead>
        <tbody>
          {Base.map ((Base, index) => (
            <tr key={index}>
 
              <th>Total</th> 
              <td className={style.titleCode}>{Base.ronda.vuelta}</td>

              <td>
                <tr>{Base.jugador1.puntaje}100</tr>
                <td className={style.titleTable}>{Base.jugador1.ganadas}0</td>
                <td className={style.titleTable}>{Base.jugador1.apostadas}0</td>
              </td>
              <td>
                <td className={style.titleTable}>{Base.jugador1.ganadas}0</td>
                <td className={style.titleTable}>{Base.jugador1.apostadas}0</td>
                <tr>{Base.jugador2.puntaje}</tr>
              </td>
              <td>
                <td className={style.titleTable}>{Base.jugador1.ganadas}0</td>
                <td className={style.titleTable}>{Base.jugador1.apostadas}0</td>
                <tr>{Base.jugador3.puntaje}</tr>
              </td>
              <td>
                <td className={style.titleTable}>{Base.jugador1.ganadas}0</td>
                <td className={style.titleTable}>{Base.jugador1.apostadas}0</td>
                <tr>{Base.jugador4.puntaje}</tr>
              </td>
              <td>
                <td className={style.titleTable}>{Base.jugador1.ganadas}0</td>
                <td className={style.titleTable}>{Base.jugador1.apostadas}0</td>
                <tr>{Base.jugador5?.puntaje}</tr>
              </td>
              <td>
                <td className={style.titleTable}>{Base.jugador1.ganadas}0</td>
                <td className={style.titleTable}>{Base.jugador1.apostadas}0</td>
                <tr>{Base.jugador6?.puntaje}</tr>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  /*  
    <div className={style.resultContain}>
      {Base.map((e, index) => (
        <div key={index} className={style.datos}>
          <div className={style.infoResult}>{e.ronda.cards}</div>
          <div className={style.infoResult}>
            {e.jugador1.puntos}
            {e.jugador1.cumplio === true ? (
              <div className={style.circuloTrue}>
                <p>{e.jugador1.apostadas}</p>
              </div>
            ) : (
              <div className={style.circlecontainer}>
                <div className={style.circle}>
                  <p>{e.jugador1.apostadas}</p>
                </div>
              </div>
            )}
          </div>
          <div className={style.infoResult}>
            {e.jugador2.puntos}
            {e.jugador2.cumplio === true ? (
              <div className={style.circuloTrue}>
                <p>{e.jugador2.apostadas}</p>
              </div>
            ) : (
              <div className={style.circlecontainer}>
                <div className={style.circle}>
                  <div className={style.number}>
                    <p>{e.jugador2.apostadas}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className={style.infoResult}>
            {e.jugador3.puntos}
            {e.jugador3.cumplio === true ? (
              <div className={style.circuloTrue}>
                <p>{e.jugador3.apostadas}</p>
              </div>
            ) : (
              <div className={style.circlecontainer}>
                <div className={style.circle}>
                  <p>{e.jugador3.apostadas}</p>
                </div>
              </div>
            )}
          </div>
          <div className={style.infoResult}>
            {e.jugador4.puntos}
            {e.jugador4.cumplio === true ? (
              <div className={style.circuloTrue}>
                <p>{e.jugador4.apostadas}</p>
              </div>
            ) : (
              <div className={style.circlecontainer}>
                <div className={style.circle}>
                  <p>{e.jugador4.apostadas}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ))} */
};

export default Result;

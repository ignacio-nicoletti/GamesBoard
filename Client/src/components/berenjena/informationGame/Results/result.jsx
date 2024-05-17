import style from './result.module.css';

const Result = ({Base}) => {
  const rows = 6;
  const columns = 7;

  return (

    <div className={style.tableWrapper}>
    <table className={style.table}>
      <thead>
        <tr>
          <th>Ronda</th>
          <th>jugador1</th>
          <th>jugador2</th>
          <th>jugador3</th>
          <th>jugador4</th>
          <th>jugador5</th>
          <th>jugador6</th>

        </tr>
      </thead>
      <tbody>
        {/* {Base.map ((Base, index) => (
          <tr key={index}>
            <td className={style.titleCode}>{Base.vuelta}</td>
            <td className={style.titleTable}>{Base.title}</td>
            <td>{Base.variant}</td>
            <td>{Base.category}</td>
            <td>{Base.brand}</td>

          </tr>
        ))} */}
      </tbody>
    </table>
  </div>

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
  )
};

export default Result;

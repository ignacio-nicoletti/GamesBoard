import style from "./result.module.css";

const Result = ({ Base }) => {
  return (
    <div className={style.resultContain}>
      <div className={style.titles}>
        <p>Ronda |</p>
        <p>jugador 1 |</p>
        <p>jugador 2 |</p>
        <p>jugador 3 |</p>
        <p>jugador 4 |</p>
      </div>

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
      ))}
    </div>
  );
};

export default Result;

import Cards from '../cards/cards';
import style from './betHorse.module.css';

const BetHorse = () => {
  return (
    <div className={style.contain}>
      <p>
        Choose your horse to win!!
      </p>
      
      <div className={style.containCards}>
        <div className={style.divCard}>
          <Cards value={'11'} suit={'oro'} />
        </div>
        <div className={style.divCard}>
          <Cards value={'11'} suit={'espada'} />
        </div>
        <div className={style.divCard}>
          <Cards value={'11'} suit={'basto'} />
        </div>
        <div className={style.divCard}>
          <Cards value={'11'} suit={'copa'} />
        </div>
      </div>
    </div>
  );
};

export default BetHorse;

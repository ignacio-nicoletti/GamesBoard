import {useState} from 'react';
import styles from './horseRace.module.css';
import LoaderHorseRace
  from '../../../components/horseRace/loader/loaderHorseRace';
import Cards from '../../../components/horseRace/cards/cards';
import DataPlayerHorseRace
  from '../../../components/horseRace/dataPlayerHorseRace/dataPlayerHorseRace';
const HorseRace = () => {
  const [loader, setLoader] = useState (false);
  return (
    <div className={styles.contain}>
      {loader
        ? <LoaderHorseRace />
        : <div className={styles.contain}>
            <DataPlayerHorseRace />
            
            <div className={styles.cardsContain}>

              <div className={styles.cards}>
                <Cards value={'11'} suit={'oro'} />
              </div>
              <div className={styles.cards}>
                <Cards value={'11'} suit={'espada'} className={styles.cards} />
              </div>
              <div className={styles.cards}>
                <Cards value={'11'} suit={'basto'} className={styles.cards} />
              </div>
              <div className={styles.cards}>
                <Cards value={'11'} suit={'copa'} className={styles.cards} />
              </div>
            </div>

            <div className={styles.cardsContainSideLeft}>
              <div className={styles.cardsSideLeft}>
                <Cards value={'8'} suit={'oro'} />
              </div>
              <div className={styles.cardsSideLeft}>
                <Cards value={'3'} suit={'copa'} />
              </div>
              <div className={styles.cardsSideLeft}>
                <Cards value={'10'} suit={'basto'} />
              </div>
              <div className={styles.cardsSideLeft}>
                <Cards value={'12'} suit={'basto'} />
              </div>
              <div className={styles.cardsSideLeft}>
                <Cards value={'4'} suit={'espada'} />
              </div>

            </div>

            <div className={styles.cardsContainMazo}>
              <Cards value={'1'} suit={'oro'} />
            </div>

            <div className={styles.table}>
              <div className={styles.row}>
                <div className={styles.cell} />
                <div className={styles.cell}>Oro</div>
                <div className={styles.cell}>Copa</div>
                <div className={styles.cell}>Espada</div>
                <div className={styles.cell}>Basto</div>
                <div className={styles.cell}>punto</div>
              </div>
              {[...Array (10)].map ((_, rowIndex) => (
                <div key={rowIndex} className={styles.row}>
                  <div className={styles.cell}>player {rowIndex + 1} </div>
                  <div className={styles.cell} />
                  <div className={styles.cell} />
                  <div className={styles.cell} />
                  <div className={styles.cell} />
                  <div className={styles.cell} />
                </div>
              ))}
            </div>

          </div>}
    </div>
  );
};

export default HorseRace;

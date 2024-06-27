import {useEffect, useState} from 'react';
import styles from './timmerComponent.module.css';

const TimmerComponent = ({type, showTimmer, setShowTimmer,timmerTicks,setRound,
  round}) => {
  const [timmer, settimer] = useState (timmerTicks);
  // Timmer entre rondas

  useEffect (() => {
    settimer (timmer); // Inicias con el valor deseado
    const time = setInterval (() => {
      settimer (prevTime => {
        if (prevTime > 0) {
          
          return prevTime - 1;
        } else {
          clearInterval (time);
          setShowTimmer(false)
         
            setRound({...round,typeRound:"Bet"})
  
          return 0;
        }
      });
    }, 1000);
    return () => clearInterval (time);
  }, []);

  return (
    <div className={styles.container}>
      <h3 className={styles.message}>
        Tiempo de espera:{' '}
        <span className={styles.timer}>{timmer}</span>
      </h3>
    </div>
  );
};

export default TimmerComponent;

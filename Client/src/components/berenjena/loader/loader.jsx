import {Link} from 'react-router-dom';
import style from './loader.module.css';

import ButtonExitRoom from '../../buttonExitRoom/buttonExitRoom';
const Loader = () => {


return (
    <div className={style.containLoader}>

      <div className={style.loader}>
        Loading...
      </div>
      <ButtonExitRoom/>
    </div>
  );
};
export default Loader;

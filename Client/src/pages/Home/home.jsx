import { Link } from "react-router-dom";
import styles from "./home.module.css"

const Home =()=>{
    return (
        <div className={styles.contain}>
        <div className={styles.containOption}>
  
          <h1>Bienvenido al Berenjena</h1>
          <div className={styles.option}>
  
            <Link to="/gameberenjenaIA" className={styles.link}>
              • Jugar contra la IA 👤
            </Link>
            <Link to="/gameberenjenafriend" className={styles.link}>
              • Jugar con un amigo 👥
            </Link>
            <Link to="/rulesofberenjena" className={styles.link}>• Reglas 📜</Link>
          </div>
  
        </div>
      </div>
    )
}
export default Home;
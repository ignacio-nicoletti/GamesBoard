import { Link } from "react-router-dom";
import styles from "./pagePrimaryBerenjena.module.css"

const PagePrimaryBerenjena =()=>{
    return (
        <div className={styles.contain}>
        <div className={styles.containOption}>
  
          <h1>Bienvenido al Berenjena</h1>
          <div className={styles.option}>
  
            <Link to="/gameberenjenaIA" className={styles.link}>
              • Jugar contra la IA 👤
            </Link>
            <Link to="/berenjena/joinRoom" className={styles.link}>
              • Jugar con un amigo 👥
            </Link>
            <Link to="/berenjena/rules" className={styles.link}>• Reglas 📜</Link>
            <Link to="/" className={styles.link}>• Inicio 📜</Link>
          </div>
  
        </div>
      </div>
    )
}
export default PagePrimaryBerenjena;
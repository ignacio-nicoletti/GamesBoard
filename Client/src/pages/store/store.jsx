import SesionLogged from "../../components/homePage/sesionLogged/sesionLogged";
import style from "./store.module.css";

const Store = () => {
  const products = [
    { title: "500 experiencia", price: "20", description: "", img: "" },
    { title: "1000 experiencia", price: "50", description: "", img: "" },
    { title: "2000 experiencia", price: "50", description: "", img: "" },
    { title: "3000 experiencia", price: "50", description: "", img: "" },
    { title: "50 Coins", price: "20", description: "", img: "" },
    { title: "100 Coins", price: "50", description: "", img: "" },
    { title: "150 Coins", price: "50", description: "", img: "" },
    { title: "200 Coins", price: "50", description: "", img: "" },
  ];

  return (
    <div className={style.contain}>
      <SesionLogged />

      <div className={style.title}>
        <p>Store</p>
      </div>

      <div className={style.MapProducts}>
        {products.map((el) => (
          <div className={style.cardProduct}>
            <p>{el.title}</p>
            <img src={el.img} alt="" />
            <p>{el.description}</p>
            <p>${el.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Store;

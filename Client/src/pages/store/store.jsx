import SesionLogged from "../../components/homePage/sesionLogged/sesionLogged";
import style from "./store.module.css";
import coins from "../../assets/homeFirst/coins.png";
import energy from "../../assets/homeFirst/energy.png";

const Store = () => {
  const consumables = [
    {
      title: "500 XP",
      price: 20,
      description: "Adquiere 500XP al game que selecciones",
      img: energy,
    },
    {
      title: "1000 XP",
      price: 50,
      description: "Adquiere 500XP al game que selecciones",
      img: energy,
    },
    {
      title: "2000 XP",
      price: 50,
      description: "Adquiere 500XP al game que selecciones",
      img: energy,
    },
    {
      title: "3000 XP",
      price: 50,
      description: "Adquiere 500XP al game que selecciones",
      img: energy,
    },
    {
      title: "50 Coins",
      price: 20,
      description: "Adquiere 50 coins ",
      img: coins,
    },
    {
      title: "100 Coins",
      price: 50,
      description: "Adquiere 100 coins ",
      img: coins,
    },
    {
      title: "150 Coins",
      price: 100,
      description: "Adquiere 150 coins ",
      img: coins,
    },
    {
      title: "200 Coins",
      price: 150,
      description: "Adquiere 200 coins ",
      img: coins,
    },
  ];

  const products = [
    { title: "Rainbow Name", price: 100 },
    { title: "Color Name", price: 100 },
    { title: "avatar 1", price: 50 },
    { title: "avatar 1", price: 50 },
    { title: "avatar 1", price: 50 },
    { title: "avatar 1", price: 50 },
   
  ];
  return (
    <div className={style.contain}>
      <SesionLogged />

      <div className={style.title}>
        <p>Store</p>
      </div>

      <div className={style.MapProducts}>
        {consumables.map((el) => (
          <div className={style.cardProduct}>
            <p>{el.title}</p>
            <img src={el.img} alt="" />
            <p className={style.description}>{el.description}</p>
            <p>${el.price}</p>
            <button>ADQUIRIR</button>
          </div>
        ))}
      </div>

      <div className={style.MapProducts}>
        {products.map((el) => (
          <div className={style.cardProduct}>
            <p>{el.title}</p>
            <img src={el.img} alt="" />
            <p className={style.description}>{el.description}</p>
            <p>${el.price}</p>
            <button>ADQUIRIR</button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Store;

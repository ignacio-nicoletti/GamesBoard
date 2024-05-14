import style from "./loader.module.css"
const Loader = () => {
  return (
    <div className={style.containLoader}>

      <div className={style.loader}>
        Loading...
      </div>
    </div>
  );
};
export default Loader;

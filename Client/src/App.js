import "./App.css";
import Home from "./pages/Home/home";
import { Route, Routes } from "react-router-dom";
import PagePrimaryBerenjena from "./pages/BerenjenaGame/PagePrimaryBerenjena/pagePrimaryBerenjena";
import RulesOfBerenjena from "./pages/BerenjenaGame/rulesBerenjena/rulesBerenjena";
import GameBerenjena from "./pages/BerenjenaGame/Berenjena/berenjena";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />



        <Route path="/berenjena" element={<PagePrimaryBerenjena/>} />
        <Route path="/rulesofberenjena" element={<RulesOfBerenjena />} />
        <Route path="/gameberenjenaIA" element={<GameBerenjena />} />
        <Route path="/gameberenjenafriend" element={<GameBerenjena />} />

      </Routes>
    </div>
  );
}

export default App;

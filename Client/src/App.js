import "./App.css";
import Home from "./pages/Home/home";
import { Route, Routes } from "react-router-dom";

import PagePrimaryBerenjena from "./pages/BerenjenaGame/PagePrimaryBerenjena/pagePrimaryBerenjena";
import RulesOfBerenjena from "./pages/BerenjenaGame/rulesBerenjena/rulesBerenjena";
import GameBerenjena from "./pages/BerenjenaGame/Berenjena/berenjena";
import JoinRoom from "./pages/BerenjenaGame/joinRoom/JoinRoom";

import PokerMenu from "./pages/PokerGame/pokerMenu/pokerMenu";
import HorseGame from "./pages/HorseGame/horseGame";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />

        {/* BERENJENA */}
        <Route path="/berenjena" element={<PagePrimaryBerenjena />} />
        <Route path="/berenjena/rules" element={<RulesOfBerenjena />} />
        <Route path="/berenjena/joinRoom" element={<JoinRoom/>}/>
        <Route path="/berenjena/multiplayer/:id" element={<GameBerenjena />} />
        <Route path="/gameberenjenaIA" element={<GameBerenjena />} />

        {/* Poker */}
        <Route path="/poker" element={<PokerMenu />} />
        {/* HorseGame */}
        <Route path="/horserace" element={<HorseGame />} />
      </Routes>
    </div>
  );
}

export default App;

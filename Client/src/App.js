import "./App.css";
import Home from "./pages/Home/home";
import { Route, Routes } from "react-router-dom";

import PagePrimaryBerenjena from "./pages/BerenjenaGame/PagePrimaryBerenjena/pagePrimaryBerenjena";
import RulesOfBerenjena from "./pages/BerenjenaGame/rulesBerenjena/rulesBerenjena";
import GameBerenjena from "./pages/BerenjenaGame/Berenjena/berenjena";
import JoinRoom from "./pages/BerenjenaGame/joinRoom/JoinRoom";

import PagePrimaryHorseGame from "./pages/HorseRaceGame/PagePrimaryHorseGame/PagePrimaryHorseGame";
import JoinRoomHorseRace from "./pages/HorseRaceGame/JoinRoomHorseRace/JoinRoomHorseRace";
import HorseRace from "./pages/HorseRaceGame/horseRace/horseRace";
import PagePrimaryPoker from "./pages/PokerGame/PagePrimaryPoker/PagePrimaryPoker";

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
        <Route path="/gameberenjenaIA" element={<JoinRoom />} />

        {/* Poker */}
        <Route path="/poker" element={<PagePrimaryPoker />} />
        {/* HorseGame */}
        <Route path="/horserace" element={<PagePrimaryHorseGame />} />
        <Route path="/horserace/joinRoom" element={<JoinRoomHorseRace/>}/>
        <Route path="/horserace/multiplayer/:id" element={<HorseRace />} />
      </Routes>
    </div>
  );
}

export default App;

import "./App.css";
import Home from "./pages/Home/home";
import { Route, Routes } from "react-router-dom";

import PagePrimaryBerenjena from "./pages/BerenjenaGame/PagePrimaryBerenjena/pagePrimaryBerenjena";
import RulesOfBerenjena from "./pages/BerenjenaGame/rulesBerenjena/rulesBerenjena";
import GameBerenjena from "./pages/BerenjenaGame/Berenjena/berenjena";
import JoinRoom from "./pages/BerenjenaGame/joinRoom/JoinRoom";

import PokerMenu from "./pages/PokerGame/pokerMenu/pokerMenu";
import { useState } from "react";

function App() {
const[roomIdberenjena,setRoomIdberenjena]=useState(null)

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />

        {/* BERENJENA */}
        <Route path="/berenjena" element={<PagePrimaryBerenjena />} />
        <Route path="/berenjena/rules" element={<RulesOfBerenjena />} />
        <Route path="/berenjena/joinRoom" element={<JoinRoom setRoomIdberenjena={setRoomIdberenjena}/>} />
        <Route path="/berenjena/multiplayer" element={<GameBerenjena roomIdberenjena={roomIdberenjena}/>} />
        <Route path="/gameberenjenaIA" element={<GameBerenjena />} />

        {/* Poker */}
        <Route path="/poker" element={<PokerMenu />} />
      </Routes>
    </div>
  );
}

export default App;

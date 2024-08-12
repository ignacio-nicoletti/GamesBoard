import "./App.css";
import Home from "./pages/Home/home";
import { Route, Routes } from "react-router-dom";

import PagePrimaryBerenjena from "./pages/BerenjenaGame/PagePrimaryBerenjena/pagePrimaryBerenjena";
import RulesOfBerenjena from "./pages/BerenjenaGame/rulesBerenjena/rulesBerenjena";
import GameBerenjena from "./pages/BerenjenaGame/Berenjena/berenjena";


import PagePrimaryHorseGame from "./pages/HorseRaceGame/PagePrimaryHorseGame/PagePrimaryHorseGame";
import HorseRace from "./pages/HorseRaceGame/horseRace/horseRace";
import PagePrimaryPoker from "./pages/PokerGame/PagePrimaryPoker/PagePrimaryPoker";
import Store from "./pages/store/store";
import { ProtectedRoute } from "./utils/ProtectedRoutes/ProtectedRoute";
import JoinRoom from "./pages/joinRoom/JoinRoom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/store"
          element={
            <ProtectedRoute>
              <Store />
            </ProtectedRoute>
          }
        />
        <Route path="/joinRoom/:params" element={<JoinRoom/>} />

        {/* BERENJENA */}
        <Route path="/berenjena" element={<PagePrimaryBerenjena />} />
        <Route path="/berenjena/multiplayer/:id" element={<GameBerenjena />} />
        <Route path="/berenjena/rules" element={<RulesOfBerenjena />} />

        {/* Poker */}
        <Route path="/poker" element={<PagePrimaryPoker />} />
        {/* HorseGame */}
        <Route path="/horserace" element={<PagePrimaryHorseGame />} />
        <Route path="/horserace/multiplayer/:id" element={<HorseRace />} />
      </Routes>
    </div>
  );
}

export default App;

{/* <Route path="/berenjena/joinRoom" element={<JoinRoom />} /> */}
{/* <Route path="/horserace/joinRoom" element={<JoinRoomHorseRace />} /> */}
import logo from "./logo.svg";
import "./App.css";
import Home from "./pages/Home/home";
import { Route, Routes } from "react-router-dom";
import RulesOfBerenjena from "./pages/rulesBerenjena/rulesBerenjena";
import GameBerenjena from "./pages/Berenjena/berenjena";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rulesofberenjena" element={<RulesOfBerenjena />} />
        <Route path="/gameberenjenaIA" element={<GameBerenjena />} />
        <Route path="/gameberenjenafriend" element={<GameBerenjena />} />

      </Routes>
    </div>
  );
}

export default App;

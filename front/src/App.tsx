import { BrowserRouter, Routes, Route } from "react-router";
import LandingPage from "./pages/LandingPage";
import LobbyPage from "./pages/LobbyPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/lobby/:lobbyid" element={<LobbyPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

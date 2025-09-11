import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Audifono from "./components/screens/AudifonoScreen/Audifono.tsx";
import Eidolon from './components/screens/Eidolon/Eidolon.jsx';
import PlayerXYCanvasWithQuiz from "./components/screens/Mission1/MissionOne.tsx";
import Landing from "./components/screens/HomeScreen/HomeScreen.tsx";
import Login from "./components/screens/LoginScreen/Login";

// import Mission from "./screens/Mission";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        {/* <Route path="/mission" element={<Mission />} /> */}
        <Route path="/audifono" element={<Audifono />} />
        <Route path="/eidolon" element={<Eidolon />} />
        <Route path="/MissionOne" element={<PlayerXYCanvasWithQuiz />} />
        <Route path="/Login" element={<Login />} />




      </Routes>
    </Router>
  );
}

export default App;

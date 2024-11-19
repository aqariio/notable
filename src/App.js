import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainMenu from "./components/MainMenu";
import Navbar from "./components/Navbar";
const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<MainMenu />} />
        </Routes>
        <Navbar />
      </Router>
    </>
  );
};
export default App;

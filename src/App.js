import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainMenu from "./components/MainMenu";
import Tasks from "./components/Tasks";
import Notebook from "./components/Notebook";
import Navbar from "./components/Navbar";
const App = () => {
  return (
    <>
      <Router>
      <Navbar />
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/notebook" element={<Notebook />} />
        </Routes>
      </Router>
    </>
  );
};
export default App;

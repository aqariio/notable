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
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/notebook" element={<Notebook />} />
          {/* <Route path="/account" element={<MainMenu />} /> */}
        </Routes>
        <Navbar />
      </Router>
    </>
  );
};
export default App;

import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
import MainMenu from "./components/MainMenu";
import Tasks from "./components/Tasks";
import Notebook from "./components/Notebook";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import PrivateRoute from "./components/PrivateRoute";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./components/Firebase";

const App = () => {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute element={<MainMenu />} />} />
          <Route path="/tasks" element={<PrivateRoute element={<Tasks />} />} />
          <Route
            path="/notebook"
            element={<PrivateRoute element={<Notebook />} />}
          />
        </Routes>
      </Router>
    </>
  );
};
export default App;

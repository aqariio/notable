import { Box } from "@mui/joy";
import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <Box
      className="navbar"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        className="navbarContent"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.1vh",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Link to="/" className="homeButton" sx={{ marginBottom: "0" }}>
            Notable
          </Link>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "7vh",
            mr: "2vh",
          }}
        >
        <Link
          to="/tasks"
          className="smallButton"
          sx={{ marginBottom: "0" }}
        >
          Tasks
        </Link>
        <Link
          to="/notebook"
          className="smallButton"
          sx={{ marginBottom: "0" }}
        >
          Notebook
        </Link>
        <Link
          to="/account"
          className="smallButton"
          sx={{ marginBottom: "0" }}
        >
          acc
        </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Navbar;

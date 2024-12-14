import React, { useState, useEffect, useCallback } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import styles from "./Navbar.module.css";
import { auth } from "./Firebase";

const pages = [
  <Link to="/tasks" class={styles.smallButton}>
    Tasks
  </Link>,
  <Link to="/notebook" class={styles.smallButton}>
    Notebook
  </Link>,
];
const settings = [<a class={styles.smallButton}>Logout</a>];

const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [user, loading] = useAuthState(auth);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleLogOut = () => {
    console.log("Logging out");
    auth
      .signOut()
      .then(() => {
        console.log("Logged out");
      })
      .catch((error) => {
        console.log(error);
      });
    handleCloseUserMenu();
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    user && (
      <AppBar position="fixed" color="primary" className={styles.navbar}>
        <Container maxWidth={false}>
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href=""
              sx={{
                mr: 2,
                marginRight: 0,
                display: { xs: "none", md: "flex" },
                fontFamily: "Inter",
                fontWeight: 700,
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <Link to="/" class={styles.homeButton}>
                Notable
              </Link>
            </Typography>

            {/* small */}

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                  "& .MuiMenu-paper": { backgroundColor: "#202020" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem className="menu" onClick={handleCloseNavMenu}>
                    <Typography
                      className={styles.smallButton}
                      textAlign="center"
                    >
                      {page}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/* large */}

            <Typography
              className={styles.homeButton}
              variant="h6"
              noWrap
              component="a"
              href=""
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "Inter",
                fontWeight: 700,
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <Link to="/" class={styles.homeButton}>
                Notable
              </Link>
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => page)}
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Account">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{
                  mt: "45px",
                  "& .MuiMenu-paper": { backgroundColor: "#202020" },
                }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "center",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "center",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    className="menu"
                    key={setting}
                    onClick={handleLogOut}
                  >
                    <Typography sx={{ textAlign: "center" }}>
                      {setting}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    )
  );
};

export default Navbar;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./Firebase";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import styles from "./Signup.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const redirectToSignup = () => {
    navigate("/signup");
  };

  const handleGoogleLogin = async (event) => {
    event.preventDefault();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        console.log(user);
        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(errorMessage);
      });
  };
  const handleLogin = async (event) => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setError(errorMessage);
      });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Paper
        sx={{
          backgroundColor: "#202020",
          color: "#aaaaaa",
          borderRadius: "10px",
          marginTop: "8vmin",
          boxShadow: 5,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          alignSelf: "center",
          width: "50vmin",
          height: "70vmin",
        }}
        variant="outlined"
      >
        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 0,
          }}
        >
          <Typography className={styles.header}>Log in</Typography>
          <TextField
            sx={{
              color: "#aaaaaa !important",
              borderRadius: "50px",
              boxShadow: 5,
              backgroundColor: "#202020",
              width: "35vmin",
              "& .MuiInputBase-input": {
                fontFamily: '"Inter", sans-serif',
                fontWeight: 400,
                color: "#aaaaaa !important",
              },
              "& .MuiInputLabel-root": {
                fontFamily: '"Inter", sans-serif',
                fontWeight: 400,
                color: "#aaaaaa !important",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#2B2B2B",
                  borderWidth: "2px",
                  borderRadius: "50px",
                },
                "&:hover fieldset": {
                  borderColor: "#404040",
                  borderWidth: "2px",
                  borderRadius: "50px",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#505050",
                  borderWidth: "2px",
                  borderRadius: "50px",
                },
              },
            }}
            autoFocus
            margin="dense"
            variant="outlined"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            sx={{
              color: "#aaaaaa !important",
              borderRadius: "50px",
              boxShadow: 5,
              backgroundColor: "#202020",
              width: "35vmin",
              "& .MuiInputBase-input": {
                fontFamily: '"Inter", sans-serif',
                fontWeight: 400,
                color: "#aaaaaa !important",
              },
              "& .MuiInputLabel-root": {
                fontFamily: '"Inter", sans-serif',
                fontWeight: 400,
                color: "#aaaaaa !important",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#2B2B2B",
                  borderWidth: "2px",
                  borderRadius: "50px",
                },
                "&:hover fieldset": {
                  borderColor: "#404040",
                  borderWidth: "2px",
                  borderRadius: "50px",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#505050",
                  borderWidth: "2px",
                  borderRadius: "50px",
                },
              },
            }}
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && (
            <Typography color="error" sx={{ marginBottom: 2 }}>
              {error}
            </Typography>
          )}
          <Button
            sx={{
              marginTop: 2,
              marginBottom: 2,
            }}
            type="submit"
            variant="contained"
            color="primary"
          >
            Log in
          </Button>
        </Box>
        <Button
          sx={{
            marginTop: 2,
            marginBottom: 2,
          }}
          onClick={redirectToSignup}
          variant="contained"
          color="primary"
        >
          Create new account
        </Button>
        <Button
          sx={{
            marginTop: 2,
            marginBottom: 2,
          }}
          onClick={handleGoogleLogin}
          variant="contained"
          color="primary"
        >
          Log in with Google
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;

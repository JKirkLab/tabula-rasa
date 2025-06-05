import { Container } from "@mui/material";
import React, { useEffect, useState } from "react";
import Layout from "./components/Layout";
import Intro from "./components/Intro";
import { Backdrop, CircularProgress, Typography, Box } from "@mui/material";


const API_BASE = process.env.REACT_APP_API_URL || '';

function App() {

  const [backendReady, setBackendReady] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/wakeup`)
      .then((res) => {
        if (res.ok) setBackendReady(true);
      })
      .catch((err) => {
        console.error('Error connecting to backend:', err);
      });
  }, []);

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Intro />
        <Layout />
      </Container>
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          flexDirection: 'column',
        }}
        open={!backendReady}
      >
        <CircularProgress color="inherit" />
        <Typography variant="h6" sx={{ mt: 2, textAlign: 'center', maxWidth: 400 }}>
          Connecting to the server. <br />
          If the server hasn’t been active for a while, please be patient — it may take up to 1–2 minutes.
        </Typography>
      </Backdrop>
    </>
  );
}

export default App;

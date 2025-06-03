import { Container } from "@mui/material";
import React, {useEffect} from "react";
import Layout from "./components/Layout";
import Intro from "./components/Intro";

const API_BASE = process.env.REACT_APP_API_URL || '';

function App() {
  useEffect(() => {
    fetch(`${API_BASE}/api/wakeup`)
      .then((res) => console.log("Backend pinged:", res.status))
      .catch((err) => console.error("Backend ping failed:", err));
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Intro/>
      <Layout/>
    </Container>
  );
}

export default App;

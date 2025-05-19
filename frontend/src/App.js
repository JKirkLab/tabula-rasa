import { Container } from "@mui/material";
import Layout from "./components/Layout";
import Intro from "./components/Intro";
function App() {

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Intro/>
      <Layout/>
    </Container>
  );
}

export default App;

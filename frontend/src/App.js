import { useEffect, useState } from "react";
import { Autocomplete, TextField, Container } from "@mui/material";
import Layout from "./components/Layout";

function App() {
  const [proteins, setProteins] = useState([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/proteins")
      .then((res) => res.json())
      .then((data) => setProteins(data));
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Autocomplete
        options={proteins}
        getOptionLabel={(option) => `${option.Accession}`}
        onChange={(e, value) => value && setSelected(value.Accession)}
        renderInput={(params) => <TextField {...params} label="Search Protein" variant="outlined" />}
        sx={{ mb: 4 }}
      />

      {selected && <Layout protein={selected} />}
    </Container>
  );
}

export default App;

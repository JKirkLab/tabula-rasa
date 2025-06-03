import {
    Box,
    Autocomplete,
    TextField,
    Container,
    Card,
    CardContent,
    CardHeader,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import LinePlot from "./LinePlot";
import BarPlot from "./BarPlot";
import VolcanoContainer from "./VolcanoContainer";
import MultiSelectContainer from "./MultiSelectContainer";
import Footer from "./Footer";

const API_BASE = process.env.REACT_APP_API_URL || '';

function Layout() {
    const [proteins, setProteins] = useState([]);
    const [selected, setSelected] = useState("");

    useEffect(() => {
        fetch(`${API_BASE}/api/proteins_60`)
            .then((res) => res.json())
            .then((data) => setProteins(data));
    }, []);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Card sx={{ mb: 4 }}>
                <CardHeader title="Protein Expression Profile" subheader={selected || "No protein selected"} />
                <CardContent>

                    <Autocomplete
                        options={proteins}
                        getOptionLabel={(option) => `${option.display}`}
                        onChange={(e, value) => value && setSelected(value.display)}
                        renderInput={(params) => (
                            <TextField {...params} label="Search Protein" variant="outlined" />
                        )}
                        sx={{ mb: 4 , width: 400}}
                    />
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column", md: "row" },
                            gap: 4,
                        }}
                    >


                        <Box sx={{ flex: 1 }}>
                            <LinePlot protein={selected} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <BarPlot protein={selected} />
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            <Card sx={{ mb: 4 }}>
                <CardHeader title="Volcano Plot" />
                <CardContent>
                    <VolcanoContainer />
                </CardContent>
            </Card>

            <Card>
                <CardHeader title="Multi-Protein Expression" />
                <CardContent>
                    <MultiSelectContainer></MultiSelectContainer>
                </CardContent>
            </Card>

            <Footer></Footer>
        </Container>
    );

}

export default Layout;

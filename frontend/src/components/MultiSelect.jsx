import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, Chip, Box } from "@mui/material";


function MultiSelect({ selectedProteins, setSelectedProteins, proteinColorMap}) {

    const [proteinOptions, setProteinOptions] = useState([]);

    useEffect(() => {
        const fetchProteins = async () => {
            try {
                const res = await fetch("/api/proteins_var");
                const data = await res.json();
                const accessions = data.map(p => p.Accession);
                setProteinOptions(accessions)

            } catch (err) {
                console.error("Failed to fetch proteins:", err)
            }
        };
        fetchProteins();
    }, []);
    return (
        <Box>
            <Autocomplete
                multiple
                options={proteinOptions}
                value={selectedProteins}
                onChange={(event, newValue) => {
                    if (newValue.length <= 5) {
                        setSelectedProteins(newValue)
                    }
                }}
                renderTags={() => null}
                renderInput={(params) => <TextField {...params} label="Select Proteins" />}
                sx={{ width: 400 }}
            />
            <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                {selectedProteins.map((protein) => (
                    <Chip
                        key={protein}
                        label={protein}
                        onDelete={() =>
                            setSelectedProteins(selectedProteins.filter((p) => p !== protein))
                        }
                        sx={{
                            bgcolor: proteinColorMap[protein],
                            color: 'white'
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
}

export default MultiSelect
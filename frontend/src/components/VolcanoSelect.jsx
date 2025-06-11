import React, { useEffect, useState } from "react";
import { Autocomplete, TextField, Box } from "@mui/material";

const timeOptions = ["5", "7", "14", "30", "60"];
const conditionOptions = {
    60: ["Flat", "Nano"]
};

const API_BASE = process.env.REACT_APP_API_URL || '';
function VolcanoSelect({ main, setMain, sub1, setSub1, sub2, setSub2 }) {
    const [proteinOptions, setProteinOptions] = useState([]);
    useEffect(() => {
        if (!main) return;
        let url = `${API_BASE}/api/proteins_time?time=${main}`;
        if (main === "60" && sub2) {
            url += `&condition=${sub2}`;
        }
        const fetchProteins = async () => {
            try {
                const response = await fetch(url);
                const data = await response.json();
                const accessions = data.map(item => item.display);

                setProteinOptions(accessions);
                setSub1(null);
            } catch (error) {
                console.error("Error fetching protein options:", error);
                setProteinOptions([]);
            }
        };

        fetchProteins();
    }, [main, sub2, setSub1, setSub2]);

    useEffect(() => {
        if (main === "60" && sub2 === null) {
            setSub2("Flat");
        }
        if (main !== "60") {
            setSub2(null);
        }
    }, [main, sub2, setSub2])

    return (
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <Autocomplete
                options={timeOptions}
                value={main}
                onChange={(e, value) => {
                    setMain(value);
                    setSub1(null);
                    setSub2(null);
                }}
                sx={{ width: 200, mb: 1 }}
                renderInput={(params) => <TextField {...params} label="Time" />}
            />

            {main && (
                <Autocomplete
                    options={proteinOptions}
                    value={sub1}
                    onChange={(e, value) => setSub1(value)}
                    sx={{ width: 200, mb: 1 }}
                    renderInput={(params) => <TextField {...params} label="Protein" />}
                />
            )}
            {main === "60" && (
                <Autocomplete
                    options={conditionOptions[main] || []}
                    value={sub2}
                    onChange={(e, value) => setSub2(value)}
                    sx={{ width: 200, mb: 1 }}
                    renderInput={(params) => <TextField {...params} label="Condition" />}
                />
            )}
        </Box>
    );
}

export default VolcanoSelect;

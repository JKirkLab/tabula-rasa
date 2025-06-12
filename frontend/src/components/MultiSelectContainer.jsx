import React, { useState, useEffect } from 'react';
import MultiSelect from "./MultiSelect";
import MultiPlot from './MultiPlot';
import MultiSelectTable from './MultiSelectTable';
import { Typography } from '@mui/material';
const API_BASE = process.env.REACT_APP_API_URL || '';

function MultiSelectContainer() {
    const [selectedProteins, setSelectedProteins] = useState([]);
    const [proteinDataMap, setProteinDataMap] = useState({});
    const colorPalette = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'];
    const proteinColorMap = selectedProteins.reduce((acc, protein, index) => {
        acc[protein] = colorPalette[index % colorPalette.length];
        return acc;
    }, {});

    useEffect(() => {
        if (!selectedProteins.length) {
            setProteinDataMap({});
            return;
        }

        const fetchData = async () => {
            const url = `${API_BASE}/api/multiline?${selectedProteins.map(p => `proteins=${p}`).join('&')}`;
            const res = await fetch(url);
            const json = await res.json();
            setProteinDataMap(json.data);
        };

        fetchData();
    }, [selectedProteins]);

    useEffect(() => {
        console.log("Selected proteins:", selectedProteins);
    }, [selectedProteins]);


    return (
        <div>
            <MultiSelect
                selectedProteins={selectedProteins}
                setSelectedProteins={setSelectedProteins}
                proteinColorMap={proteinColorMap}
            />

            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <MultiPlot
                    proteinDataMap={proteinDataMap}
                    proteinColorMap={proteinColorMap}
                />
                {selectedProteins.length > 0 && (
                    <div>
                        <MultiSelectTable
                            proteinDataMap={proteinDataMap}
                            selectedProteins={selectedProteins}
                        />
                        <Typography sx={{ mt: 1, ml: 1 }}>
                            Dash (-) indicates no p-value
                        </Typography>
                    </div>
                )}
            </div>
        </div>
    );
}
export default MultiSelectContainer
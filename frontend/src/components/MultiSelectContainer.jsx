import React, { useState, useEffect } from 'react';
import MultiSelect from "./MultiSelect";
import MultiPlot from './MultiPlot';
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
            const url = `/api/multiline?${selectedProteins.map(p => `proteins=${p}`).join('&')}`;
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
                proteinColorMap={ proteinColorMap }
            />
            <MultiPlot proteinDataMap={proteinDataMap}
                proteinColorMap={proteinColorMap} />
        </div>
    );
}
export default MultiSelectContainer
import React from "react";
import Plot from "react-plotly.js";

function MultiPlot({ proteinDataMap , proteinColorMap}) {
    if (!proteinDataMap || Object.keys(proteinDataMap).length === 0) {
        return null;
    }

    const traces = Object.entries(proteinDataMap).map(([protein, data]) => {
        const validPoints = data.filter(d => d.ratio !== null);

        return {
            x: validPoints.map(d => d.time),
            y: validPoints.map(d => d.ratio),
            name: protein,
            type: 'scatter',
            mode: 'lines+markers',
            line: {
                color: proteinColorMap?.[protein] || undefined,
                shape: 'linear'
            },
            marker: {
                color: proteinColorMap?.[protein] || undefined,
                size: 6
            }
        };
    });

    return (
        <Plot
            data={traces}
            layout={{
                title: 'Abundance Ratios Over Time',
                xaxis: { title: 'Time (days)', dtick: 5 },
                yaxis: { title: 'Mutant / Control Ratio' },
                margin: { t: 40, r: 20, b: 60, l: 60 },
                legend: { orientation: 'h' },
                height: 500
            }}

            config={{ responsive: true }}
            useResizeHandler
            style={{ width: '100%', height: '100%' }}
        />
    );
}

export default MultiPlot;

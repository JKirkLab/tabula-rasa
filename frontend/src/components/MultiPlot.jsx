import React from "react";
import Plot from "react-plotly.js";
import { Box, Typography } from "@mui/material";

function MultiPlot({ proteinDataMap, proteinColorMap }) {
  const hasData =
    proteinDataMap &&
    Object.keys(proteinDataMap).some(
      protein => Array.isArray(proteinDataMap[protein]) && proteinDataMap[protein].length > 0
    );

  if (!hasData) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height={500}
        width="100%"
        sx={{ border: "1px dashed gray", bgcolor: "#f9f9f9", mt: 2 }}
      >
        <Typography variant="h6" color="text.secondary">
          Select proteins to display data.
        </Typography>
      </Box>
    );
  }


  const traces = hasData
    ? Object.entries(proteinDataMap).map(([protein, data]) => {
      const validPoints = data.filter(d => d.ratio !== null);
      return {
        x: validPoints.map(d => d.time),
        y: validPoints.map(d => d.ratio),
        name: protein,
        type: 'scatter',
        mode: 'lines+markers',
        line: {
          color: proteinColorMap?.[protein],
          shape: 'linear'
        },
        marker: {
          color: proteinColorMap?.[protein],
          size: 6
        }
      };
    })
    : [];

  return (
    <Box sx={{ width: '100%', height: 500 }}>
      {!hasData && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
          sx={{ border: '1px dashed gray', bgcolor: '#f9f9f9' }}
        >
          <Typography variant="h6" color="text.secondary">
            Select proteins to display data.
          </Typography>
        </Box>
      )}
      <Plot
        data={traces}
        layout={{
          title: 'Abundance Ratios Over Time',
          xaxis: { title: { text: 'Days of Maturation' }, dtick: 5 },
          yaxis: { title: { text: 'D65A/WT' } },
          margin: { t: 40, r: 20, b: 120, l: 60 },
          legend: { orientation: 'h', y: -0.2 },
          height: 500
        }}
        config={{ displayModeBar: false, responsive: true }}
        useResizeHandler
        style={{ width: '90%', height: '100%' }}
      />
    </Box>
  );
}

export default MultiPlot;

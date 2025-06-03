import Plot from "react-plotly.js";
import { useEffect, useState } from "react";
import { Box } from '@mui/material';

const API_BASE = process.env.REACT_APP_API_URL || '';

function LinePlot({ protein }) {
  const [lineData, setLineData] = useState([]);

  useEffect(() => {
    if (protein) {
      fetch(`${API_BASE}/api/data?protein=${protein}`)
        .then((res) => res.json())
        .then((res) => setLineData(res));
    }
  }, [protein]);

  const sorted = [...lineData].sort((a, b) => a.time - b.time);
  const mutant = sorted.filter((d) => d.condition === "mutant");
  const control = sorted.filter((d) => d.condition === "control");

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Plot
        data={[
          {
            x: mutant.map(d => d.time),
            y: mutant.map(d => d.abundance),
            error_y: {
              type: 'data',
              array: mutant.map(d => d.sem),
              visible: true
            },
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Mutant',
            line: {
              color: 'red'
            },
            marker: {
              symbol: 'circle-open'
            }
          },
          {
            x: control.map(d => d.time),
            y: control.map(d => d.abundance),
            error_y: {
              type: 'data',
              array: control.map(d => d.sem),
              visible: true
            },
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Control',
            line: {
              color: 'black'
            }
          }
        ]}
        layout={{
          autosize: true,
          title: `Protein Expression: ${protein}`,
          xaxis: {
            title: {
              text: "Days of Maturation",
              font: { size: 16 }
            },
            type: "linear",
            tickwidth: 1.5,
            ticklen: 6,
            showline: true,
            gridcolor: 'rgba(0,0,0,0)',
            range: [0, null]
          },
          yaxis: {
            title: {
              text: `Normalized Grouped <br>${protein} Abundance`,
              font: { size: 16 },
              
            },
            showline: true,
            gridcolor: 'rgba(0,0,0,0)',
            ticklen: 6,
            tickwidth: 1.5,
            linewidth: 1.5,
            range: [0, null],
            fixedrange: false 
          },
          margin: {
            l: 100,
            t: 40,
            b: 100,
            r: 30
          },
          width: null,
          height: null
        }}
        config={{ displayModeBar: false, responsive: true}}
        style={{ width: '100%', height: '100%' }}
        useResizeHandler={true}
      />
    </Box>
  );

}

export default LinePlot;

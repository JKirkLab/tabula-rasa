import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { CircularProgress, Box, Typography } from "@mui/material";

function VolcanoPlot({ timePoint, protein }) {
    const [data, setData] = useState([]);
    const [layout, setLayout] = useState({});
    const [loading, setLoading] = useState(false);
    const [revision, setRevision] = useState(0);

    useEffect(() => {
        if (!timePoint) return;

        setLoading(true);
        fetch(`/api/volcano?time_point=${timePoint}`)
            .then(res => res.json())
            .then(json => {
                const points = json.data;

                let xValues = points.map(p => p.log2FC);
                const yValues = points.map(p => p.neg_log10_p);

                const xMin = Math.min(...xValues);
                const xMax = Math.max(...xValues);
                const yMax = Math.max(...yValues);

                const xPadding = 1;
                const yPadding = 1;

                const xRange = [xMin - xPadding, xMax + xPadding];
                const yRange = [0, yMax + yPadding];

                const accessions = points.map(p => p.Accession);

                const selectedIndex = accessions.indexOf(protein);
                const mainTrace = {
                    x: xValues,
                    y: yValues,
                    text: accessions,
                    mode: 'markers',
                    type: 'scatter',
                    marker: {
                        size: 6,
                        color: accessions.map(acc => {
                            if (!protein) return 'blue';
                            return acc === protein ? 'transparent' : 'gray';
                        }),
                        opacity: accessions.map(acc => {
                            if (!protein) return 1;
                            return acc === protein ? 0 : 0.05;
                        })

                    },
                    hovertemplate: 'Accession: %{text}<br>log2FC: %{x}<br>-log10(p): %{y}<extra></extra>',
                    showlegend: false
                };

                const highlightTrace = {
                    x: selectedIndex !== -1 ? [xValues[selectedIndex]] : [],
                    y: selectedIndex !== -1 ? [yValues[selectedIndex]] : [],
                    text: selectedIndex !== -1 ? [protein] : [],
                    mode: 'markers+text',
                    type: 'scatter',
                    marker: {
                        size: 14,
                        color: 'red',
                        line: {
                            color: 'black',
                            width: 2
                        }
                    },
                    textposition: 'top center',
                    hovertemplate: 'Selected: %{text}<br>log2FC: %{x}<br>-log10(p): %{y}<extra></extra>',
                    showlegend: false,
                    visible: selectedIndex !== -1 ? true : 'legendonly'
                };

                setData([mainTrace, highlightTrace]);

                setLayout({
                    title: `Volcano Plot (Day ${timePoint})`,
                    xaxis: {
                        title: 'log2 Fold Change',
                        range: xRange,
                        autorange: false
                    },
                    yaxis: {
                        title: '-log10(p-value)',
                        range: yRange,
                        autorange: false
                    },
                    shapes: [
                        {
                            type: 'line',
                            x0: -1, x1: -1,
                            y0: yRange[0], y1: yRange[1],
                            xref: 'x',
                            yref: 'y',
                            line: {
                                color: 'red',
                                width: 1,
                                dash: 'dash'
                            }
                        },
                        {
                            type: 'line',
                            x0: 1, x1: 1,
                            y0: yRange[0], y1: yRange[1],
                            xref: 'x',
                            yref: 'y',
                            line: {
                                color: 'red',
                                width: 1,
                                dash: 'dash'
                            }
                        },
                        {
                            type: 'line',
                            x0: xRange[0], x1: xRange[1],
                            y0: 1.3, y1: 1.3,
                            xref: 'x',
                            yref: 'y',
                            line: {
                                color: 'blue',
                                width: 1,
                                dash: 'dash'
                            }
                        }
                    ],
                    height: 600,
                    width: 800
                });
                setRevision(prev => prev + 1);

            });
    }, [timePoint, protein]);
    if (!timePoint) {
        return (
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                height={600}
                width="100%"
                sx={{ border: '1px dashed gray', bgcolor: '#f9f9f9' }}
            >
                <Typography variant="h6" color="text.secondary">
                    Select a time point to display the volcano plot.
                </Typography>
            </Box>
        );
    }
    if (!data.length || !layout) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height={600}
            >
                <CircularProgress />
            </Box>
        );
    }
    return <Plot
        data={data}
        layout={layout}
        revision={revision}
        config={{ displayModeBar: false, responsive: true }}
        style={{ width: "100%", height: "100%" }}
        useResizeHandler
    />
        ;
}

export default VolcanoPlot
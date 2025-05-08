import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { Box } from "@mui/material";

function BarPlot({ protein }) {
    const [barData, setBarData] = useState(null);

    useEffect(() => {
        if (protein) {
            fetch(`http://localhost:8000/bar?protein=${protein}`)
                .then((res) => res.json())
                .then(setBarData);
        }
    }, [protein]);

    if (!barData) return null;
    const { bars, pvals } = barData;

    const formatP = (p) => {
        if (p == null) return "ns";
        if (p < 0.001) return "***";
        if (p < 0.01) return "**";
        if (p < 0.05) return "*";
        return p.toFixed(3);
    };

    const getPValue = (comparison) => {
        const [[cond1, grp1], [cond2, grp2]] = comparison;

        const matchingPVal = pvals.find(p =>
            (p.group1[0] === cond1 && p.group1[1] === grp1 &&
                p.group2[0] === cond2 && p.group2[1] === grp2) ||
            (p.group1[0] === cond2 && p.group1[1] === grp2 &&
                p.group2[0] === cond1 && p.group2[1] === grp1)
        );

        return matchingPVal ? matchingPVal.p : null;
    };
    const order = [
        { condition: "FLAT", group: "Wildtype" },
        { condition: "NANO", group: "Wildtype" },
        { condition: "FLAT", group: "D65A" },
        { condition: "NANO", group: "D65A" }
    ];

    const tickLabels = order.map(o => `${o.group} ${o.condition}`)
    const x = order.map((_, i) => i);
    const y = order.map(({ condition, group }) => {
        const match = bars.find(b => b.condition === condition && b.group === group);
        return match?.abundance ?? 0;

    });
    const sem = bars.map(d => d.sem);


    const comparisons = [
        [["FLAT", "Wildtype"], ["NANO", "Wildtype"]],
        [["FLAT", "D65A"], ["NANO", "D65A"]],
        [["FLAT", "Wildtype"], ["FLAT", "D65A"]],
        [["NANO", "Wildtype"], ["NANO", "D65A"]]
    ];


    const significanceShapes = [];
    const significanceAnnotations = [];
    const currentHeights = y.map((val, i) => val + sem[i]);

    for (let i = 0; i < comparisons.length; i++) {
        const [[cond1, grp1], [cond2, grp2]] = comparisons[i];
        const label1 = `${grp1} ${cond1}`;
        const label2 = `${grp2} ${cond2}`;
        const x1 = tickLabels.indexOf(label1);
        const x2 = tickLabels.indexOf(label2);
        if (x1 === -1 || x2 === -1) continue;

        const baseHeight = Math.max(currentHeights[x1], currentHeights[x2]) + 0.7;
        const height = baseHeight + i * 0.3;

        significanceShapes.push({
            type: "line",
            xref: "x",
            yref: "y",
            x0: x1,
            x1: x2,
            y0: height,
            y1: height,
            line: { color: "black", width: 1 }
        });

        significanceShapes.push({
            type: "line",
            xref: "x",
            yref: "y",
            x0: x1,
            x1: x1,
            y0: currentHeights[x1] + 0.4,
            y1: height,
            line: { color: "black", width: 1 }
        });

        significanceShapes.push({
            type: "line",
            xref: "x",
            yref: "y",
            x0: x2,
            x1: x2,
            y0: currentHeights[x2] + 0.4,
            y1: height,
            line: { color: "black", width: 1 }
        });

        significanceAnnotations.push({
            x: (x1 + x2) / 2,
            xref: "x",
            y: height + 0.30,
            text: formatP(getPValue(comparisons[i])),
            showarrow: false,
            font: { size: 14 },
            xanchor: "center"
        });

        for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
            currentHeights[x] = height + 0.30;
        }
    }


    //red is 255 0 0sat 240 lum 120
    //light rd 255 224 224 sat 240 lum 225
    //light grey 212 212 212 hue 160 lum 200
    const barColors = order.map(({ condition, group }) => {
        let fillColor = "steelblue";
        let lineColor = "gray"
        if (condition === "FLAT" && group === "Wildtype") {
            fillColor = "rgba(212,212,212,1)";
            lineColor = "black";
        } else if (condition === "NANO" && group === "Wildtype") {
            fillColor = "rgba(212,212,212,1)";
            lineColor = "black";
        } else if (condition === "FLAT" && group === "D65A") {
            fillColor = "rgba(255,224,224,1)";
            lineColor = "rgba(255,0,0,1)";
        } else if (condition === "NANO" && group === "D65A") {
            fillColor = "rgba(255,224,224,1)";
            lineColor = "rgba(255,0,0,1)";
        }

        return {
            fill: fillColor,
            line: lineColor
        }
    });

    return (
        <Box sx={{ width: '100%', height: '100%' }}>
            <Plot
                data={[
                    {
                        type: "bar",
                        x: x,
                        y: y,
                        error_y: {
                            type: 'data',
                            array: bars.map(d => d.sem),
                            visible: true
                        },
                        marker: {
                            color: barColors.map(c => c.fill),
                            line: {
                                color: barColors.map(c => c.line),
                                width: 2
                            }
                        },
                        width: 0.5
                    }
                ]}
                layout={{
                    title: `Normalized Abundance for ${protein}`,
                    barmode: "group",
                    bargap: 0.25,
                    autosize: true,
                    margin: { t: 40, b: 80, l: 60, r: 30 }, // Already has 80px bottom margin for the tilted labels
                    xaxis: {
                      tickvals: x,
                      ticktext: tickLabels,
                      tickwidth: 1.5,
                      ticklen: 6,
                      tickangle: -45,
                      title: "Group",
                      linewidth: 1.5,
                      tickcolor: '#000',
                      showline: true
                    },
                    yaxis: {
                      title: {
                        text: `Normalized Grouped <br>${protein} Abundance`,
                        font: { size: 16 }
                      },
                      gridcolor: 'rgba(0,0,0,0)',
                      ticklen: 6,
                      tickwidth: 1.5,
                      linewidth: 1.5,
                      tickcolor: '#000',
                      showline: true,
                      range: [0, null],
                      fixedrange: false 
                    },
                    width: null,
                    height: null,
                    shapes: significanceShapes,
                    annotations: significanceAnnotations
                  }}
                config={{ displayModeBar: false, responsive: true}}
                style={{ width: '100%', height: '100%' }}
                useResizeHandler={true}
            />
        </Box>
    );
}

export default BarPlot;

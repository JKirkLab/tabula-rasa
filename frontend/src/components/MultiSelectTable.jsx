import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography
} from "@mui/material";

const timepoints = [5, 7, 14, 30, 60];

function getPValueStars(p) {
    if (p == null) return "-";
    if (p < 0.001) return "***";
    if (p < 0.01) return "**";
    if (p < 0.05) return "*";
    return "n.s.";
}

function MultiSelectTable({ proteinDataMap, selectedProteins }) {
    //   if (!Object.keys(proteinDataMap).length) {
    //     return (
    //       <Typography variant="body1" sx={{ p: 2 }}>
    //         No data available. Please select proteins to display.
    //       </Typography>
    //     );
    //   }
    console.log(proteinDataMap);
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Protein</TableCell>
                        {timepoints.map(tp => (
                            <TableCell key={tp} align="center">
                                {tp} Days
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {selectedProteins.map(protein => {
                        const data = proteinDataMap[protein] || [];
                        return (
                            <TableRow key={protein}>
                                <TableCell>{protein}</TableCell>
                                {timepoints.map(tp => {
                                    const match = data.find(d => d.time === tp);
                                    const pValue = match?.p_value;
                                    return (
                                        <TableCell key={tp} align="center">
                                            {getPValueStars(pValue)}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
export default MultiSelectTable;

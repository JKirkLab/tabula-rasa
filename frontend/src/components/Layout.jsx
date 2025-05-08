import { Box, Typography } from "@mui/material";
import LinePlot from "./LinePlot";
import BarPlot from "./BarPlot";

function Layout({ protein }) {
  return (
    <Box sx={{ 
      width: '100%', 
      py: 4,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: {xs: 'column', md: 'row'}, 
        justifyContent: 'center',
        alignItems: 'flex-start', // Align items at the top
        width: '100%',
        maxWidth: 1200,
        mx: 'auto'
      }}>
        {/* Line Plot */}
        <Box 
          sx={{ 
            width: {xs: '100%', md: '50%'}, 
            height: 450,
            p: 2
          }}
        >
          <LinePlot protein={protein} />
        </Box>

        {/* Bar Plot */}
        <Box 
          sx={{ 
            width: {xs: '100%', md: '50%'}, 
            height: 450,
            p: 2
          }}
        >
          <BarPlot protein={protein} />
        </Box>
      </Box>
    </Box>
  );
}

export default Layout;
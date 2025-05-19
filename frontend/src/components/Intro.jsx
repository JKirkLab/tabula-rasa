import { Box, Container, Typography, Divider } from "@mui/material";
function Intro() {
    return (
        <div>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box sx={{ textAlign: 'left' }}>
                    <Typography
                        variant="h2"
                        sx={{
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 600,
                            fontSize: { xs: '1rem', sm: '2rem', md: '3rem' },
                            width: '100%',
                        }}
                    >
                        iPSC Proteomics Data Viewer Webtool
                    </Typography>
                    <Divider
                        sx={{
                            width: '100%',
                            height: '1px',
                            backgroundColor: '#D3D3D3',
                            margin: '0 auto',
                            mt: 2,
                            mb: 2,
                            opacity: 0.5,
                        }}
                    />
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        {`This is an interactive webtool designed to allow the user to explore the iPSC proteomics data set for the publication titled: `}
                    </Typography>

                    <Typography variant="body1" fontWeight={700} sx={{ mb: 2 }}>
                        {`Calcium-Activated Sarcomere Contractility Drives Cardiomyocyte Maturation and the Response to External Mechanical Cues 
                        but is Dispensable for Sarcomere Formation. `}
                    </Typography>
                    <Typography variant="body1" fontWeight={700} sx={{ mb: 2 }}>
                        Authors: Laura A. Sherer<sup>1*</sup>, Abigail Nagle<sup>2*</sup>, Mary Papadaki<sup>1</sup>, Seby Edassery<sup>1</sup>, Dasom Yoo<sup>2</sup>, Lauren D’Amico<sup>2</sup>, Daniel Brambila-Diaz<sup>2</sup>, Mark Qiao<sup>1</sup>, Michael Regnier<sup>2</sup>, Jonathan A. Kirk<sup>1†</sup>
                    </Typography>

                    <Typography>
                        Affiliations:
                    </Typography>
                    <Typography >
                        1. Department of Cell and Molecular Physiology, Loyola University Stritch School of Medicine, Maywood, IL
                    </Typography>
                    <Typography sx={{ mb: 2 }}>
                        2. Department of Bioengineering, University of Washington, Seattle, USA.
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        {`iPSCs with homozygous D65A cardiac Troponin C (cTnC) modifications were differentiated into 
                        cardiomyocytes and matured up to 60 days. This modification prevents cTnC from binding to calcium in the N-terminal 
                        regulatory site II. As a result, the troponin complex does not undergo the conformational change that allows 
                        tropomyosin to move away from myosin binding sites on the thin filament, preventing sarcomere contraction. 
                        Mass spectrometry was performed at Days 5, 7, 14, 30, and 60. In addition, another cohort of samples was replated onto 
                        nanopatterned surfaces at Day 46 and assessed via mass spectrometry on Day 60.`}
                    </Typography>

                </Box>
            </Container>
        </div>
    );
}

export default Intro;
//
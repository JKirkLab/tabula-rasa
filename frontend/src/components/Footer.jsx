import { Box, Container, Typography, Link, Button, Divider } from "@mui/material";
import GitHub from '@mui/icons-material/GitHub';
import Article from '@mui/icons-material/Article';
import Email from '@mui/icons-material/Email';
function Footer() {
    return (
        <div>
            <Container maxWidth="lg" disableGutters sx={{ py: 4 }}>
                <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Have Suggestions about or found issues with the webtool? Please contact Mark Qiao {' '}
                        <Link
                            href="mailto:mqiao@luc.edu">
                            <Email sx={{ verticalAlign: 'middle' }}></Email>
                        </Link>

                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Questions about the Study? Please contact Jonathan Kirk {' '}
                        <Link
                            href="mailto:jkirk2@luc.edu">
                            <Email sx={{ verticalAlign: 'middle' }}></Email>
                        </Link>
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
                            This project uses an icon designed by almaCELL, licensed under CC BY 4.0. No changes were made to the icon, and no endorsement is implied. The icon was downloaded from BioIcons <br />
                            Webtool Layout inspired by <Link href="https://writing-assistant.github.io">A Design Space for Intelligent and Interactive Writing Assistants</Link>.

                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row"
                        }}
                    >
                        <Button
                            startIcon={<GitHub />}
                            onClick={() => window.open('https://github.com/JKirkLab/tabula-rasa')}
                            sx={{
                                minWidth: 'auto',
                                textTransform: 'none',
                                color: 'inherit',
                                backgroundColor: 'transparent',
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                    textDecoration: 'underline',
                                }
                            }}
                        >
                            Github
                        </Button>

                        <Button
                            startIcon={<Article />}
                            onClick={() => window.open('https://www.google.com')}
                            sx={{
                                minWidth: 'auto',
                                textTransform: 'none',
                                color: 'inherit',
                                backgroundColor: 'transparent',
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                    textDecoration: 'underline',
                                }
                            }}
                        >
                            Paper
                        </Button>
                    </Box>


                </Box>
            </Container>
        </div>
    );
}

export default Footer;

import { Box, Container, Typography, Link, Button } from "@mui/material";
import GitHub from '@mui/icons-material/GitHub';
import Article from '@mui/icons-material/Article';
import Email from '@mui/icons-material/Email';
function Footer() {
    return (
        <div>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Suggestions or issues about the webtool? Please contact Mark Qiao {' '}
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

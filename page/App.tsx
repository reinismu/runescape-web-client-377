import React from "react";
import { hot } from "react-hot-loader";
import { WebScape } from "./WebScape";
import Button from "@material-ui/core/Button";
import { ThemeProvider } from "@material-ui/styles";
import theme from "./Theme";
import { Container, AppBar, Toolbar, Typography, Paper, Box, Grid } from "@material-ui/core";
import Hero from "./components/Hero";
import image from "./images/wildy.png";

const App = () => {
    return (
        <div>
            <ThemeProvider theme={theme}>
                <AppBar color="primary" position="static">
                    <Hero imageUrl={image} />
                </AppBar>
                <Container maxWidth="md">
                    <Paper>
                        <Typography variant="h4" component="h3">
                            Web Runescape client prototype
                        </Typography>
                        <Typography component="p">Page is super basic</Typography>
                        <Typography component="p">Use any username/password to log in</Typography>
                        <Typography component="p">If you have good ideas about how this could be used for private servers, let me know</Typography>
                        <Typography component="p">You can find me in RuneStatus discord -> user Detuks#7978</Typography>
                    </Paper>
                    <Grid container justify="center">
                        <WebScape />
                    </Grid>
                </Container>
            </ThemeProvider>
        </div>
    );
};

export default hot(module)(App);

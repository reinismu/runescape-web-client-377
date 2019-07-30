import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Box, Grid } from "@material-ui/core";

interface StyleProps {
    imageUrl: string;
}

export interface HeroProps {
    imageUrl: string;
}

const useStyles = makeStyles(theme => ({
    heroImage: (props: StyleProps) => ({
        backgroundImage: `url(${props.imageUrl}); no-repeat`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
        height: "10vw"
    })
}));

const Hero = (props: HeroProps) => {
    const classes = useStyles({ imageUrl: props.imageUrl });

    return (
        <Box className={classes.heroImage}>
        </Box>
    );
};

export default Hero;

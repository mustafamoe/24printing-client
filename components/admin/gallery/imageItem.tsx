import ImageOpt from "../../imageOpt";
import { useState } from "react";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import {
    makeStyles,
    Button,
    Menu,
    MenuItem,
    Box,
    Grid,
} from "@material-ui/core";
import { IImage } from "../../../types/image";

const useStyles = makeStyles({
    root: {
        width: "19%",
        margin: "0.5%",
        paddingBottom: "19%",
        position: "relative",
        boxShadow:
            "0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)",
        "&:hover": {
            boxShadow:
                "0px 3px 3px -2px rgb(0 0 0 / 50%), 0px 3px 4px 0px rgb(0 0 0 / 30%), 0px 1px 8px 0px rgb(0 0 0 / 20%)",
            "& $settingsContainer": {
                opacity: 1,
            },
        },
    },
    settingsContainer: {
        position: "absolute",
        right: "10px",
        top: "10px",
        zIndex: 1,
        opacity: 0,
    },
});

interface IProps {
    image: IImage;
    handleOpenDel: any;
}

const ImageItem = ({ image, handleOpenDel }: IProps) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const delAction = () => {
        handleOpenDel(image);
        handleClose();
    };

    return (
        <Grid classes={{ root: classes.root }} item>
            <div className={classes.settingsContainer}>
                <Box width={45}>
                    <Button
                        style={{ minWidth: "100%" }}
                        size="small"
                        variant="contained"
                        color="secondary"
                        onClick={handleClick}
                    >
                        <MoreHorizIcon />
                    </Button>
                </Box>
                <Menu
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    onClose={handleClose}
                >
                    <MenuItem onClick={delAction}>Delete</MenuItem>
                </Menu>
            </div>
            <ImageOpt src={image?.image_name} layout="fill" objectFit="cover" />
        </Grid>
    );
};

export default ImageItem;

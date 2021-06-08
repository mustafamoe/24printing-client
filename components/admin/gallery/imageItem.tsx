import ImageOpt from "../../imageOpt";
import { useState } from "react";
import {
    makeStyles,
    Button,
    Menu,
    MenuItem,
    Box,
    Typography,
    Grid,
    Theme,
    createStyles,
} from "@material-ui/core";
import { IImage } from "../../../types/image";

// icons
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
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
                "& $toolbar": {
                    opacity: 1,
                },
            },
        },
        settingsContainer: {},
        toolbar: {
            position: "absolute",
            alignItems: "center",
            zIndex: 1,
            opacity: 0,
            padding: "10px",
            backgroundColor: "white",
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            boxShadow: theme.shadows[10],
        },
    })
);

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
                <Box className={classes.toolbar}>
                    <Typography>{image.title}</Typography>
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
                    {/* <MenuItem onClick={delAction}>Edit</MenuItem> */}
                </Menu>
            </div>
            <ImageOpt src={image?.image_name} layout="fill" objectFit="cover" />
        </Grid>
    );
};

export default ImageItem;

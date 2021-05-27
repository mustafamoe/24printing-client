import ImageOpt from "../../imageOpt";
import dateFormat from "dateformat";
import parse from "html-react-parser";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import { useState } from "react";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import {
    makeStyles,
    Typography,
    Button,
    Menu,
    MenuItem,
    Box,
} from "@material-ui/core";
import { IAdvCard } from "../../../types/advCard";

const useStyles = makeStyles({
    root: {
        "&:hover": {
            boxShadow:
                "0px 0px 5px 1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
            backgroundColor: "rgb(245, 245, 245)",
        },
    },
    tableCell: {
        maxWidth: "200px",
        whiteSpace: "nowrap",
        overflowX: "hidden",
        textOverflow: "ellipsis",
    },
    sticky: {
        zIndex: 1,
    },
    stickyHover: {
        zIndex: 1,
        right: "0",
        position: "sticky",
    },
});

interface IProps {
    advCard: IAdvCard;
    handleOpenDel: any;
    handleOpenEdit: any;
}

const AdvCardItem = ({ advCard, handleOpenDel, handleOpenEdit }: IProps) => {
    const classes = useStyles();
    const [isHover, setHover] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const delAction = () => {
        handleOpenDel(advCard);
        handleClose();
    };

    const handleMouseOver = () => {
        setHover(true);
    };

    const handleMouseLeave = () => {
        setHover(false);
    };

    const handleEdit = () => {
        handleClose();
        handleOpenEdit(advCard);
    };

    return (
        <TableRow
            onMouseOver={handleMouseOver}
            onMouseLeave={handleMouseLeave}
            classes={{ root: classes.root }}
            key={advCard.adv_card_id}
        >
            <TableCell
                style={{
                    whiteSpace: "nowrap",
                }}
            >
                {advCard.adv_card_id}
            </TableCell>
            <TableCell>
                <div
                    style={{
                        position: "relative",
                        width: "50px",
                        height: "50px",
                        overflow: "hidden",
                        borderRadius: "50%",
                    }}
                >
                    <ImageOpt
                        src={advCard.image?.image_name}
                        layout="fill"
                        objectFit="cover"
                    />
                </div>
            </TableCell>
            <TableCell
                classes={{
                    root: classes.tableCell,
                }}
            >
                {advCard.title || <Typography align="center">-</Typography>}
            </TableCell>
            <TableCell
                classes={{
                    root: classes.tableCell,
                }}
            >
                {advCard.content ? (
                    parse(advCard.content)
                ) : (
                    <Typography align="center">-</Typography>
                )}
            </TableCell>
            <TableCell
                title={advCard.link}
                classes={{
                    root: classes.tableCell,
                }}
            >
                {advCard.link || <Typography align="center">-</Typography>}
            </TableCell>
            <TableCell style={{ whiteSpace: "nowrap" }}>
                {dateFormat(
                    advCard.created_at,
                    "dddd, mmmm dS, yyyy, h:MM:ss TT"
                )}
            </TableCell>
            <TableCell
                classes={{
                    root: classes.tableCell,
                }}
            >
                {advCard.created_by?.username || (
                    <Typography align="center">-</Typography>
                )}
            </TableCell>
            <TableCell style={{ whiteSpace: "nowrap" }}>
                {dateFormat(
                    advCard.updated_at,
                    "dddd, mmmm dS, yyyy, h:MM:ss TT"
                )}
            </TableCell>
            <TableCell
                classes={{
                    root: classes.tableCell,
                }}
            >
                {advCard.updated_by?.username || (
                    <Typography align="center">-</Typography>
                )}
            </TableCell>
            <TableCell
                classes={{
                    root: isHover ? classes.stickyHover : classes.sticky,
                }}
            >
                <Box width={45}>
                    <Button
                        style={{ minWidth: "100%" }}
                        aria-controls="simple-menu"
                        aria-haspopup="true"
                        size="small"
                        variant="contained"
                        color="secondary"
                        onClick={handleClick}
                    >
                        <MoreHorizIcon />
                    </Button>
                </Box>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleEdit}>Edit</MenuItem>
                    <MenuItem onClick={delAction}>Delete</MenuItem>
                </Menu>
            </TableCell>
        </TableRow>
    );
};

export default AdvCardItem;

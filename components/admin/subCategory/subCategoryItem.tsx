import dateFormat from "dateformat";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { useState } from "react";
import {
    makeStyles,
    Typography,
    Button,
    Menu,
    MenuItem,
    Box,
} from "@material-ui/core";

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

const SubCategoryItem = ({ subCategory, handleOpenDel, handleOpenEdit }) => {
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
        handleOpenDel(subCategory);
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
        handleOpenEdit(subCategory);
    };

    return (
        <TableRow
            classes={{ root: classes.root }}
            onMouseOver={handleMouseOver}
            onMouseLeave={handleMouseLeave}
            key={subCategory.sub_category_id}
        >
            <TableCell
                style={{
                    whiteSpace: "nowrap",
                }}
            >
                {subCategory.sub_category_id}
            </TableCell>
            <TableCell
                classes={{
                    root: classes.tableCell,
                }}
            >
                {subCategory.sub_category_name}
            </TableCell>
            <TableCell
                classes={{
                    root: classes.tableCell,
                }}
            >
                {subCategory.sub_category_order}
            </TableCell>
            <TableCell
                classes={{
                    root: classes.tableCell,
                }}
            >
                {subCategory.category?.category_name}
            </TableCell>
            <TableCell
                classes={{
                    root: classes.tableCell,
                }}
            >
                {subCategory.is_hidden ? "True" : "False"}
            </TableCell>
            <TableCell
                style={{
                    whiteSpace: "nowrap",
                }}
            >
                {dateFormat(
                    subCategory.created_at,
                    "dddd, mmmm dS, yyyy, h:MM:ss TT"
                )}
            </TableCell>
            <TableCell
                style={{
                    whiteSpace: "nowrap",
                }}
            >
                {subCategory?.created_by.username || (
                    <Typography align="center">-</Typography>
                )}
            </TableCell>
            <TableCell
                style={{
                    whiteSpace: "nowrap",
                }}
            >
                {dateFormat(
                    subCategory.updated_at,
                    "dddd, mmmm dS, yyyy, h:MM:ss TT"
                )}
            </TableCell>
            <TableCell
                style={{
                    whiteSpace: "nowrap",
                }}
            >
                {subCategory.updated_by.username || (
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

export default SubCategoryItem;

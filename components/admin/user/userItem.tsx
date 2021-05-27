import ImageOpt from "../../imageOpt";
import dateFormat from "dateformat";
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
import { IUser } from "../../../types/user";

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
    user: IUser;
    handleOpenBlock: any;
    handleOpenRole: any;
    handleOpenAdmin: any;
}

const UserItem = ({
    user,
    handleOpenBlock,
    handleOpenAdmin,
    handleOpenRole,
}: IProps) => {
    const classes = useStyles();
    const [isHover, setHover] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const blockAction = () => {
        handleOpenBlock(user);
        handleClose();
    };

    const adminAction = () => {
        handleOpenAdmin(user);
        handleClose();
    };

    const roleAction = () => {
        handleOpenRole(user);
        handleClose();
    };

    const handleMouseOver = () => {
        setHover(true);
    };

    const handleMouseLeave = () => {
        setHover(false);
    };

    return (
        <TableRow
            onMouseOver={handleMouseOver}
            onMouseLeave={handleMouseLeave}
            classes={{ root: classes.root }}
            key={user.user_id}
        >
            <TableCell
                style={{
                    whiteSpace: "nowrap",
                }}
            >
                {user.user_id}
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
                        src={user.avatar?.image_name}
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
                {user.first_name}
            </TableCell>
            <TableCell
                classes={{
                    root: classes.tableCell,
                }}
            >
                {user.last_name}
            </TableCell>
            <TableCell style={{ whiteSpace: "nowrap" }}>
                {user.username}
            </TableCell>
            <TableCell
                classes={{
                    root: classes.tableCell,
                }}
            >
                {user.email}
            </TableCell>
            <TableCell style={{ whiteSpace: "nowrap" }}>{user.phone}</TableCell>
            <TableCell style={{ whiteSpace: "nowrap" }}>
                {user.is_active ? "True" : "False"}
            </TableCell>
            <TableCell style={{ whiteSpace: "nowrap" }}>
                {user.is_blocked ? "True" : "False"}
            </TableCell>
            <TableCell style={{ whiteSpace: "nowrap" }}>
                {user.is_admin ? "True" : "False"}
            </TableCell>
            <TableCell style={{ whiteSpace: "nowrap" }}>
                {user.is_super_admin ? "True" : "False"}
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
                    <MenuItem onClick={roleAction}>Edit</MenuItem>
                    <MenuItem onClick={adminAction}>
                        {user.is_admin ? "Remove admin" : "Set admin"}
                    </MenuItem>
                    <MenuItem onClick={blockAction}>
                        {user.is_blocked ? "Unblock" : "Block"}
                    </MenuItem>
                    <MenuItem onClick={blockAction}>Give discount</MenuItem>
                </Menu>
            </TableCell>
        </TableRow>
    );
};

export default UserItem;

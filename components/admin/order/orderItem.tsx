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
import { IOrder } from "../../../types/order";

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
    order: IOrder;
    handleOpenEdit: any;
    handleOpenDecline: any;
    router: any;
}

const OrderItem = ({
    order,
    handleOpenEdit,
    handleOpenDecline,
    router,
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

    const handleMouseOver = () => {
        setHover(true);
    };

    const handleMouseLeave = () => {
        setHover(false);
    };

    const handleEdit = () => {
        handleClose();
        handleOpenEdit(order);
    };

    const handleDecline = () => {
        handleClose();
        handleOpenDecline(order);
    };

    const handleDetails = () => {
        handleClose();
        router.push(`/admin/orders/${order.order_id}`);
    };

    const statusColors = {
        reviewing: { backgroundColor: "#FF4F53", color: "white" },
        approved: { backgroundColor: "#FFC700", color: "white" },
        "under process": { backgroundColor: "#008ADC", color: "white" },
        "ready to ship": { backgroundColor: "#00CE88", color: "white" },
        completed: { backgroundColor: "#CE488F", color: "white" },
    };

    return (
        <TableRow
            onMouseOver={handleMouseOver}
            onMouseLeave={handleMouseLeave}
            classes={{ root: classes.root }}
            key={order.order_id}
        >
            <TableCell
                style={{
                    whiteSpace: "nowrap",
                }}
            >
                {order.order_id}
            </TableCell>
            <TableCell
                style={{
                    whiteSpace: "nowrap",
                }}
            >
                {parseFloat(String(order.charge.amount / 100)).toFixed(2)}د.ا
                AED {order.charge.status}
            </TableCell>
            <TableCell
                classes={{
                    root: classes.tableCell,
                }}
            >
                <Box display="flex">
                    {order.products.map((p) => (
                        <div
                            style={{
                                position: "relative",
                                width: "50px",
                                height: "50px",
                                overflow: "hidden",
                                borderRadius: "50%",
                                marginRight: "10px",
                            }}
                        >
                            <ImageOpt
                                src={String(p.image)}
                                layout="fill"
                                objectFit="cover"
                            />
                        </div>
                    ))}
                </Box>
            </TableCell>
            <TableCell style={{ whiteSpace: "nowrap" }}>
                {dateFormat(
                    order.expected_date,
                    "dddd, mmmm dS, yyyy, h:MM:ss TT"
                )}
            </TableCell>
            <TableCell
                classes={{
                    root: classes.tableCell,
                }}
            >
                <div className="order-status-container">
                    <div
                        style={statusColors[order.status]}
                        className="order-status-content-container"
                    >
                        <p className="order-status-content-text">
                            {order.status}
                        </p>
                    </div>
                </div>
            </TableCell>
            <TableCell style={{ whiteSpace: "nowrap" }}>
                {dateFormat(
                    order.created_at,
                    "dddd, mmmm dS, yyyy, h:MM:ss TT"
                )}
            </TableCell>
            <TableCell
                classes={{
                    root: classes.tableCell,
                }}
            >
                {order.created_by?.username || (
                    <Typography align="center">-</Typography>
                )}
            </TableCell>
            <TableCell style={{ whiteSpace: "nowrap" }}>
                {dateFormat(
                    order.updated_at,
                    "dddd, mmmm dS, yyyy, h:MM:ss TT"
                )}
            </TableCell>
            <TableCell
                classes={{
                    root: classes.tableCell,
                }}
            >
                {order.updated_by?.username || (
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
                    <MenuItem onClick={handleDetails}>Details</MenuItem>
                    <MenuItem onClick={handleEdit}>Manage</MenuItem>
                    <MenuItem onClick={handleDecline}>Decline</MenuItem>
                </Menu>
            </TableCell>
        </TableRow>
    );
};

export default OrderItem;

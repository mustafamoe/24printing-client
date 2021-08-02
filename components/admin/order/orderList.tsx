import useSWR from "swr";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { TablePagination } from "@material-ui/core";
import { useState } from "react";
import { IOrder } from "../../../types/order";
import { mutate } from "swr";
import { apiCall } from "../../../utils/apiCall";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { RootReducer } from "../../../store/reducers";

// components
import OrderItem from "./orderItem";
import OrderForm from "./orderForm";
import ActionModal from "../actionModal";
import OrderDetails from "./orderDetails";

// icons
import ClearIcon from "@material-ui/icons/Clear";

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

interface IDeclineState {
    order: IOrder | null;
    loading: boolean;
    error: string[] | null;
}

const OrderList = () => {
    const router = useRouter();
    const classes = useStyles();
    const user = useSelector((state: RootReducer) => state.auth.user);
    const { data } = useSWR(`/all_orders?authId=${user.user_id}`);
    const [isEdit, setEdit] = useState<IOrder | null>(null);
    const [isDecline, setDecline] = useState<IDeclineState>({
        order: null,
        loading: false,
        error: null,
    });
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenEdit = (order: IOrder) => {
        setEdit(order);
    };

    const handleCloseEdit = () => {
        setEdit(null);
    };

    // ------------------------------ decline
    const handleOpenDecline = (order: IOrder) => {
        setDecline({ ...isDecline, order });
    };

    const handleCloseDecline = () => {
        setDecline({ ...isDecline, order: null });
    };

    const handleDecline = async () => {
        if (isDecline) {
            try {
                setDecline({ ...isDecline, loading: true });

                await apiCall(
                    "post",
                    `/order/${isDecline.order.order_id}/decline?authId=${user.user_id}`
                );

                setDecline({ ...isDecline, loading: false });

                mutate(`/orders?authId=${user.user_id}`, (orders: IOrder[]) => {
                    return orders.map((o) =>
                        o.order_id === isDecline.order.order_id
                            ? { ...o, status: "declined" }
                            : o
                    );
                });

                handleCloseDecline();
            } catch (err) {
                setDecline({ ...isDecline, loading: false });
                setDecline({ ...isDecline, error: err });
            }
        }
    };

    if (data)
        return (
            <>
                <TableContainer component={Paper}>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    style={{ minWidth: "150px" }}
                                    align="left"
                                >
                                    Amount
                                </TableCell>
                                <TableCell
                                    style={{ minWidth: "150px" }}
                                    align="left"
                                >
                                    Products
                                </TableCell>
                                <TableCell
                                    style={{
                                        maxWidth: "250px",
                                        minWidth: "250px",
                                    }}
                                    align="left"
                                >
                                    Expected Date
                                </TableCell>
                                <TableCell
                                    style={{ minWidth: "150px" }}
                                    align="left"
                                >
                                    Status
                                </TableCell>
                                <TableCell
                                    style={{ minWidth: "150px" }}
                                    align="left"
                                >
                                    Placed at
                                </TableCell>
                                <TableCell
                                    style={{ minWidth: "150px" }}
                                    align="left"
                                >
                                    Placed by
                                </TableCell>
                                <TableCell
                                    style={{ minWidth: "150px" }}
                                    align="left"
                                >
                                    Updated at
                                </TableCell>
                                <TableCell
                                    style={{ minWidth: "150px" }}
                                    align="left"
                                >
                                    Updated by
                                </TableCell>
                                <TableCell
                                    style={{ minWidth: "50px" }}
                                    align="left"
                                >
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data
                                .slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                )
                                .map((order) => (
                                    <OrderItem
                                        key={order.order_id}
                                        order={order}
                                        handleOpenEdit={handleOpenEdit}
                                        handleOpenDecline={handleOpenDecline}
                                        router={router}
                                    />
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                    component="div"
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
                {isEdit && <OrderForm close={handleCloseEdit} order={isEdit} />}
                {isDecline.order && (
                    <ActionModal
                        close={handleCloseDecline}
                        title="Decline order"
                        msg={`Are you sure you want to delete the order?`}
                        handler={handleDecline}
                        btnTxt="decline"
                        loading={isDecline.loading}
                        error={isDecline.error}
                        btnIcon={<ClearIcon />}
                    />
                )}
            </>
        );
    return null;
};

export default OrderList;

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
import { IUser } from "../../../types/user";
import { mutate } from "swr";
import { apiCall } from "../../../utils/apiCall";
import { useSelector } from "react-redux";
import { RootReducer } from "../../../store/reducers";

// components
import UserItem from "./userItem";
import ActionModal from "../actionModal";
import UserForm from "./userForm";
import UserDiscountForm from "./userDiscountForm";

// icons
import AddIcon from "@material-ui/icons/Add";
import BlockIcon from "@material-ui/icons/Block";
import RemoveIcon from "@material-ui/icons/Remove";

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

const UserList = () => {
    const classes = useStyles();
    const user = useSelector((state: RootReducer) => state.auth.user);
    const { data } = useSWR(user ? `/users?authId=${user.user_id}` : null);
    const [isBlock, setBlock] = useState<null | IUser>(null);
    const [isRole, setRole] = useState<null | IUser>(null);
    const [isAdmin, setAdmin] = useState<null | IUser>(null);
    const [isDisc, setDisc] = useState<null | IUser>(null);
    const [isRemoveDisc, setRemoveDisc] = useState<null | IUser>(null);
    const [isEditDisc, setEditDisc] = useState<null | IUser>(null);
    const [blockLoading, setBlockLoading] = useState(false);
    const [adminLoading, setAdminLoading] = useState(false);
    const [removeDiscLoading, setRemoveDiscLoading] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenBlock = (user: IUser) => {
        setBlock(user);
    };

    const handleCloseBlock = () => {
        setBlock(null);
    };

    const handleOpenAdmin = (user: IUser) => {
        setAdmin(user);
    };

    const handleCloseAdmin = () => {
        setAdmin(null);
    };

    const handleOpenRole = (user: IUser) => {
        setRole(user);
    };

    const handleCloseRole = () => {
        setRole(null);
    };

    const handleOpenDisc = (user: IUser) => {
        setDisc(user);
    };

    const handleCloseDisc = () => {
        setDisc(null);
    };

    const handleOpenRemoveDisc = (user: IUser) => {
        setRemoveDisc(user);
    };

    const handleCloseRemoveDisc = () => {
        setRemoveDisc(null);
    };

    const handleOpenEditDisc = (user: IUser) => {
        setEditDisc(user);
    };

    const handleCloseEditDisc = () => {
        setEditDisc(null);
    };

    const handleBlock = async () => {
        try {
            setBlockLoading(true);
            await apiCall(
                "post",
                `/block_user/${isBlock.user_id}?authId=${user.user_id}&block=${
                    isBlock.is_blocked ? "false" : "true"
                }`
            );

            mutate(
                `/users?authId=${user.user_id}`,
                (users: IUser[]) => {
                    return users.map((u) =>
                        u.user_id === isBlock.user_id
                            ? { ...u, is_blocked: !isBlock.is_blocked }
                            : u
                    );
                },
                false
            );

            setBlockLoading(false);
            handleCloseBlock();
        } catch (err) {
            setBlockLoading(false);
        }
    };

    const handleAdmin = async () => {
        try {
            setAdminLoading(true);
            await apiCall(
                "post",
                `/user_role/${isAdmin.user_id}?authId=${user.user_id}&admin=${
                    isAdmin.is_admin ? "false" : "true"
                }`
            );

            mutate(
                `/users?authId=${user.user_id}`,
                (users: IUser[]) => {
                    return users.map((u) =>
                        u.user_id === isAdmin.user_id
                            ? { ...u, is_admin: !isAdmin.is_admin }
                            : u
                    );
                },
                false
            );

            setAdminLoading(false);
            handleCloseAdmin();
        } catch (err) {
            setAdminLoading(false);
        }
    };

    const handleRemoveDisc = async () => {
        try {
            setRemoveDiscLoading(true);
            await apiCall(
                "delete",
                `/user_discount/${isRemoveDisc.discount.user_discount_id}?authId=${user.user_id}`
            );

            mutate(
                `/users?authId=${user.user_id}`,
                (users: IUser[]) => {
                    return users.map((u) =>
                        u.user_id === isRemoveDisc.user_id
                            ? { ...u, discount: null }
                            : u
                    );
                },
                false
            );

            setRemoveDiscLoading(false);
            handleCloseRemoveDisc();
        } catch (err) {
            setRemoveDiscLoading(false);
        }
    };

    if (data)
        return (
            <>
                <TableContainer component={Paper}>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ minWidth: "150px" }}>
                                    Avatar
                                </TableCell>
                                <TableCell style={{ minWidth: "150px" }}>
                                    First name
                                </TableCell>
                                <TableCell style={{ minWidth: "150px" }}>
                                    Last name
                                </TableCell>
                                <TableCell style={{ minWidth: "150px" }}>
                                    Username
                                </TableCell>
                                <TableCell style={{ minWidth: "150px" }}>
                                    Email
                                </TableCell>
                                <TableCell style={{ minWidth: "150px" }}>
                                    Phone Number
                                </TableCell>
                                <TableCell style={{ minWidth: "150px" }}>
                                    Active
                                </TableCell>
                                <TableCell style={{ minWidth: "150px" }}>
                                    Blocked
                                </TableCell>
                                <TableCell style={{ minWidth: "150px" }}>
                                    Admin
                                </TableCell>
                                <TableCell style={{ minWidth: "50px" }}>
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
                                .map((user) => (
                                    <UserItem
                                        key={user.user_id}
                                        user={user}
                                        handleOpenBlock={handleOpenBlock}
                                        handleOpenAdmin={handleOpenAdmin}
                                        handleOpenRole={handleOpenRole}
                                        handleOpenDisc={handleOpenDisc}
                                        handleOpenRemoveDisc={
                                            handleOpenRemoveDisc
                                        }
                                        handleOpenEditDisc={handleOpenEditDisc}
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
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                {isBlock && (
                    <ActionModal
                        close={handleCloseBlock}
                        title="Block user"
                        btnTxt={isBlock.is_blocked ? "unblock" : "block"}
                        type={isBlock.is_blocked ? "confirmation" : "warning"}
                        msg={`Are you sure you want to ${
                            isBlock.is_blocked ? "unblock" : "block"
                        } ${isBlock.username}?`}
                        btnIcon={
                            isBlock.is_blocked ? <RemoveIcon /> : <BlockIcon />
                        }
                        handler={handleBlock}
                        loading={blockLoading}
                    />
                )}
                {isAdmin && (
                    <ActionModal
                        close={handleCloseAdmin}
                        title="User role"
                        btnTxt={isAdmin.is_admin ? "remove admin" : "set admin"}
                        type={isAdmin.is_admin ? "warning" : "confirmation"}
                        msg={`Are you sure you want to ${
                            isAdmin.is_admin
                                ? `remove ${isAdmin.username} from being an admin?`
                                : `set ${isAdmin.username} to be an admin?`
                        }`}
                        handler={handleAdmin}
                        btnIcon={
                            isAdmin.is_admin ? <RemoveIcon /> : <AddIcon />
                        }
                        loading={adminLoading}
                    />
                )}
                {isRole && <UserForm close={handleCloseRole} user={isRole} />}
                {isDisc && (
                    <UserDiscountForm
                        userId={isDisc.user_id}
                        close={handleCloseDisc}
                    />
                )}
                {isEditDisc && (
                    <UserDiscountForm
                        userDiscount={isEditDisc.discount}
                        userId={isEditDisc.user_id}
                        close={handleCloseEditDisc}
                    />
                )}
                {isRemoveDisc && (
                    <ActionModal
                        close={handleCloseRemoveDisc}
                        title="Remove discount"
                        btnTxt="remove discount"
                        type="warning"
                        msg={`Are you sure you want to remove discount.`}
                        handler={handleRemoveDisc}
                        btnIcon={<RemoveIcon />}
                        loading={removeDiscLoading}
                    />
                )}
            </>
        );
    return null;
};

export default UserList;

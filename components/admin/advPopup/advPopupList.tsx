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
import { IAdvPopup } from "../../../types/advPopup";
import { mutate } from "swr";
import { apiCall } from "../../../utils/apiCall";
import { useSelector } from "react-redux";
import { RootReducer } from "../../../store/reducers";

// components
import AdvPopupItem from "./advPopupItem";
import ActionModal from "../actionModal";
import AdvPopupForm from "./advPopupForm";

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

const AdvPopupList = () => {
    const classes = useStyles();
    const user = useSelector((state: RootReducer) => state.auth.user);
    const { data } = useSWR("/adv_popups");
    const [isDel, setDel] = useState<null | IAdvPopup>(null);
    const [isEdit, setEdit] = useState<null | IAdvPopup>(null);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [delLoading, setDelLoading] = useState(false);
    const [page, setPage] = useState(0);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenDel = (advPopup: IAdvPopup) => {
        setDel(advPopup);
    };

    const handleCloseDel = () => {
        setDel(null);
    };

    const handleOpenEdit = (advPopup: IAdvPopup) => {
        setEdit(advPopup);
    };

    const handleCloseEdit = () => {
        setEdit(null);
    };

    const handleDelete = async () => {
        try {
            setDelLoading(true);
            await apiCall(
                "delete",
                `/adv_popup/${isDel.adv_popup_id}?authId=${user.user_id}`
            );

            mutate("/adv_popups", (advPopups: IAdvPopup[]) => {
                return advPopups.filter(
                    (ap) => ap.adv_popup_id !== isDel.adv_popup_id
                );
            });

            setDelLoading(false);
            handleCloseDel();
        } catch (err) {
            setDelLoading(false);
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
                                    Image
                                </TableCell>
                                <TableCell
                                    style={{ minWidth: "150px" }}
                                    align="left"
                                >
                                    Active
                                </TableCell>
                                <TableCell
                                    style={{ minWidth: "150px" }}
                                    align="left"
                                >
                                    Link
                                </TableCell>
                                <TableCell
                                    style={{ minWidth: "150px" }}
                                    align="left"
                                >
                                    Created at
                                </TableCell>
                                <TableCell
                                    style={{ minWidth: "150px" }}
                                    align="left"
                                >
                                    Created by
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
                                .map((advPopup) => (
                                    <AdvPopupItem
                                        key={advPopup.adv_popup_id}
                                        advPopup={advPopup}
                                        handleOpenDel={handleOpenDel}
                                        handleOpenEdit={handleOpenEdit}
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
                {isDel && (
                    <ActionModal
                        close={handleCloseDel}
                        title="Delete adv popup"
                        msg={`Are you sure you want to delete this adv popup?`}
                        handler={handleDelete}
                        loading={delLoading}
                    />
                )}
                {isEdit && (
                    <AdvPopupForm close={handleCloseEdit} advPopup={isEdit} />
                )}
            </>
        );
    return null;
};

export default AdvPopupList;

import useSwr from "swr";
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
import { IAdvCard } from "../../../types/advCard";
import { mutate } from "swr";
import { apiCall } from "../../../utils/apiCall";
import { useSelector } from "react-redux";
import { RootReducer } from "../../../store/reducers";

// components
import AdvCardItem from "./advCardItem";
import ActionModal from "../actionModal";
import AdvCardForm from "./advCardForm";

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

const AdvCardList = () => {
    const classes = useStyles();
    const user = useSelector((state: RootReducer) => state.auth.user);
    const { data } = useSwr("/adv_cards");
    const [isDel, setDel] = useState<null | IAdvCard>(null);
    const [isEdit, setEdit] = useState<null | IAdvCard>(null);
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

    const handleOpenDel = (advCard: IAdvCard) => {
        setDel(advCard);
    };

    const handleCloseDel = () => {
        setDel(null);
    };

    const handleOpenEdit = (advCard: IAdvCard) => {
        setEdit(advCard);
    };

    const handleCloseEdit = () => {
        setEdit(null);
    };

    const handleDelete = async () => {
        try {
            setDelLoading(true);
            await apiCall(
                "delete",
                `/adv_card/${isDel.adv_card_id}?authId=${user.user_id}`
            );

            mutate(
                "/adv_cards",
                (advCards: IAdvCard[]) => {
                    return advCards.filter(
                        (p) => p.adv_card_id !== isDel.adv_card_id
                    );
                },
                false
            );

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
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    style={{ minWidth: "150px" }}
                                    align="left"
                                >
                                    Id
                                </TableCell>
                                <TableCell
                                    style={{ minWidth: "150px" }}
                                    align="left"
                                >
                                    Image
                                </TableCell>
                                <TableCell
                                    style={{
                                        maxWidth: "250px",
                                        minWidth: "250px",
                                    }}
                                    align="left"
                                >
                                    Title
                                </TableCell>
                                <TableCell
                                    style={{ minWidth: "150px" }}
                                    align="left"
                                >
                                    Content
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
                                .map((advCard) => (
                                    <AdvCardItem
                                        key={advCard.adv_card_id}
                                        advCard={advCard}
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
                        title="Delete adv card"
                        msg={`Are you sure you want to delete ${isDel.title}?`}
                        handler={handleDelete}
                        loading={delLoading}
                    />
                )}
                {isEdit && (
                    <AdvCardForm close={handleCloseEdit} advCard={isEdit} />
                )}
            </>
        );
    return null;
};

export default AdvCardList;

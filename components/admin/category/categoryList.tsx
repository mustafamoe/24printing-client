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
import { ICategory } from "../../../types/category";
import { mutate } from "swr";
import { apiCall } from "../../../utils/apiCall";
import { useSelector } from "react-redux";
import { RootReducer } from "../../../store/reducers";

// components
import CategoryItem from "./categoryItem";
import ActionModal from "../actionModal";
import CategoryForm from "./categoryForm";

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

interface IProps {
    categories: ICategory[];
}

const CategoryList = ({ categories }: IProps) => {
    const classes = useStyles();
    const user = useSelector((state: RootReducer) => state.auth.user);
    const [isDel, setDel] = useState<null | ICategory>(null);
    const [isEdit, setEdit] = useState<null | ICategory>(null);
    const [delLoading, setDelLoading] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenDel = (product: ICategory) => {
        setDel(product);
    };

    const handleCloseDel = () => {
        setDel(null);
    };

    const handleOpenEdit = (product: ICategory) => {
        setEdit(product);
    };

    const handleCloseEdit = () => {
        setEdit(null);
    };

    const handleDelete = async () => {
        try {
            setDelLoading(true);
            await apiCall(
                "delete",
                `/category/${isDel.category_id}?authId=${user.user_id}`
            );

            mutate("/categories", (categories: ICategory[]) => {
                return categories.filter(
                    (c) => c.category_id !== isDel.category_id
                );
            });

            setDelLoading(false);
            handleCloseDel();
        } catch (err) {
            setDelLoading(false);
        }
    };

    if (categories)
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
                                    Name
                                </TableCell>
                                <TableCell
                                    style={{ minWidth: "150px" }}
                                    align="left"
                                >
                                    Order
                                </TableCell>
                                <TableCell
                                    style={{ minWidth: "150px" }}
                                    align="left"
                                >
                                    Hidden
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
                                    style={{ minWidth: "150px" }}
                                    align="left"
                                >
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categories
                                .sort(
                                    (a, b) =>
                                        Number(a.category_order) -
                                        Number(b.category_order)
                                )
                                .slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                )
                                .map((category) => (
                                    <CategoryItem
                                        handleOpenDel={handleOpenDel}
                                        handleOpenEdit={handleOpenEdit}
                                        key={category.category_id}
                                        category={category}
                                    />
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                    component="div"
                    count={categories.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                {isDel && (
                    <ActionModal
                        close={handleCloseDel}
                        title="Delete category"
                        msg={`Are you sure you want to delete ${isDel.category_name}?`}
                        handler={handleDelete}
                        loading={delLoading}
                    />
                )}
                {isEdit && (
                    <CategoryForm
                        close={handleCloseEdit}
                        categoryLength={categories.length}
                        category={isEdit}
                    />
                )}
            </>
        );
    return null;
};

export default CategoryList;

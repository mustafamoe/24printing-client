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
import { ISubCategory } from "../../../types/subCategory";
import { mutate } from "swr";
import { apiCall } from "../../../utils/apiCall";
import { useSelector } from "react-redux";
import { RootReducer } from "../../../store/reducers";

// components
import SubCategoryItem from "./subCategoryItem";
import SubCategoryForm from "./subCategoryForm";
import ActionModal from "../actionModal";

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

const SubCategoryList = () => {
    const user = useSelector((state: RootReducer) => state.auth.user);
    const classes = useStyles();
    const { data } = useSwr("/sub_categories");
    const [isDel, setDel] = useState<null | ISubCategory>(null);
    const [isEdit, setEdit] = useState<null | ISubCategory>(null);
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

    const handleOpenDel = (product: ISubCategory) => {
        setDel(product);
    };

    const handleCloseDel = () => {
        setDel(null);
    };

    const handleOpenEdit = (product: ISubCategory) => {
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
                `/sub_category/${isDel.sub_category_id}?authId=${user.user_id}`
            );

            mutate(
                "/sub_categories",
                (subCategories: ISubCategory[]) => {
                    return subCategories.filter(
                        (c) => c.sub_category_id !== isDel.sub_category_id
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
                                    Category
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
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data
                                .slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                )
                                .map((subCategory) => (
                                    <SubCategoryItem
                                        handleOpenDel={handleOpenDel}
                                        handleOpenEdit={handleOpenEdit}
                                        key={subCategory.sub_category_id}
                                        subCategory={subCategory}
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
                        title="Delete sub category"
                        msg={`Are you sure you want to delete ${isDel.sub_category_name}?`}
                        handler={handleDelete}
                        loading={delLoading}
                    />
                )}
                {isEdit && (
                    <SubCategoryForm
                        close={handleCloseEdit}
                        subCategory={isEdit}
                    />
                )}
            </>
        );
    return null;
};

export default SubCategoryList;

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
import { IProduct } from "../../../types/product";
import { mutate } from "swr";
import { apiCall } from "../../../utils/apiCall";
import { useSelector } from "react-redux";
import { RootReducer } from "../../../store/reducers";

// components
import ProductItem from "./productItem";
import ActionModal from "../actionModal";
import DiscountForm from "../discount/discountForm";
import ProductForm from "./productForm";

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

const ProductList = () => {
    const classes = useStyles();
    const user = useSelector((state: RootReducer) => state.auth.user);
    const { data } = useSWR("/products");
    const [isDel, setDel] = useState<IProduct | null>(null);
    const [isEdit, setEdit] = useState<IProduct | null>(null);
    const [isDiscount, setDiscount] = useState<IProduct | null>(null);
    const [isDelDisc, setDelDisc] = useState<IProduct | null>(null);
    const [delDiscLoading, setDelDiscLoading] = useState(false);
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

    const handleOpenDel = (product: IProduct) => {
        setDel(product);
    };

    const handleCloseDel = () => {
        setDel(null);
    };

    const handleOpenEdit = (product: IProduct) => {
        setEdit(product);
    };

    const handleCloseEdit = () => {
        setEdit(null);
    };

    const handleOpenDiscount = (product: IProduct) => {
        setDiscount(product);
    };

    const handleCloseDiscount = () => {
        setDiscount(null);
    };

    const handleOpenDelDisc = (product: IProduct) => {
        setDelDisc(product);
    };

    const handleCloseDelDisc = () => {
        setDelDisc(null);
    };

    const handleDelete = async () => {
        try {
            setDelLoading(true);
            await apiCall(
                "delete",
                `/product/${isDel.product_id}?authId=${user.user_id}`
            );

            mutate("/products", (products: IProduct[]) => {
                return products.filter(
                    (p) => p.product_id !== isDel.product_id
                );
            });

            setDelLoading(false);
            handleCloseDel();
        } catch (err) {
            setDelLoading(false);
        }
    };

    const handleDelDisc = async () => {
        try {
            setDelDiscLoading(true);
            await apiCall(
                "delete",
                `/discount/${isDelDisc.discount?.discount_id}?authId=${user.user_id}`
            );

            mutate(
                "/products",
                (products) => {
                    return products.map((p) =>
                        p.product_id !== isDelDisc.product_id
                            ? p
                            : { ...p, discount: null }
                    );
                },
                false
            );

            setDelDiscLoading(false);
            handleCloseDelDisc();
        } catch (err) {
            setDelDiscLoading(false);
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
                                    Name
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
                                    Description
                                </TableCell>
                                <TableCell
                                    style={{ minWidth: "150px" }}
                                    align="left"
                                >
                                    About
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
                                    Sub category
                                </TableCell>
                                <TableCell
                                    style={{ minWidth: "150px" }}
                                    align="left"
                                >
                                    Featured
                                </TableCell>
                                <TableCell
                                    style={{ minWidth: "150px" }}
                                    align="left"
                                >
                                    Published
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
                                .map((product) => (
                                    <ProductItem
                                        key={product.product_id}
                                        product={product}
                                        handleOpenDel={handleOpenDel}
                                        handleOpenEdit={handleOpenEdit}
                                        handleOpenDiscount={handleOpenDiscount}
                                        handleOpenDelDisc={handleOpenDelDisc}
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
                        title="Delete product"
                        msg={`Are you sure you want to delete ${isDel.product_name}?`}
                        handler={handleDelete}
                        loading={delLoading}
                    />
                )}
                {isEdit && (
                    <ProductForm close={handleCloseEdit} product={isEdit} />
                )}
                {isDiscount && (
                    <DiscountForm
                        close={handleCloseDiscount}
                        product={isDiscount}
                    />
                )}
                {isDelDisc && (
                    <ActionModal
                        close={handleCloseDelDisc}
                        title="Remove discount"
                        msg={`Are you sure you want to remove discount for ${isDelDisc.product_name}?`}
                        handler={handleDelDisc}
                        loading={delDiscLoading}
                        btnTxt="remove"
                    />
                )}
            </>
        );
    return null;
};

export default ProductList;

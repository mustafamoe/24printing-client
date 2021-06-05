import {
    Box,
    Typography,
    Button,
    createStyles,
    makeStyles,
    Theme,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { useState } from "react";

// components
import AdminLayout from "../../../components/admin/adminLayout";
import HeadLayout from "../../../components/headLayout";
import ProductList from "../../../components/admin/product/productList";
import ProductForm from "../../../components/admin/product/productForm";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        head: {
            backgroundColor: "white",
            padding: "10px 0",
            position: "sticky",
            zIndex: 3,
            top: 0,
        },
    })
);

const Products = () => {
    const classes = useStyles();
    const [isAdd, setAdd] = useState<boolean>(false);

    const closeAdd = () => {
        setAdd(false);
    };

    const openAdd = () => {
        setAdd(true);
    };

    return (
        <>
            <HeadLayout title="Admin Products" />
            <AdminLayout access="is_admin">
                <div style={{ width: "100%" }}>
                    <Box display="flex" flexDirection="column">
                        <Box
                            className={classes.head}
                            display="flex"
                            flexDirection="row"
                        >
                            <Box flexGrow={1} style={{ marginBottom: "30px" }}>
                                <Typography variant="h5">Products</Typography>
                            </Box>
                            <Box>
                                <Button
                                    startIcon={<Add />}
                                    variant="contained"
                                    type="button"
                                    onClick={openAdd}
                                    color="primary"
                                >
                                    add product
                                </Button>
                            </Box>
                        </Box>
                        <div>
                            <ProductList />
                        </div>
                    </Box>
                </div>
                {isAdd && <ProductForm close={closeAdd} />}
            </AdminLayout>
        </>
    );
};

export default Products;

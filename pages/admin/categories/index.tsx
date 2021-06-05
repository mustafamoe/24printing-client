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
import useSWR from "swr";
import { ICategory } from "../../../types/category";

// components
import AdminLayout from "../../../components/admin/adminLayout";
import HeadLayout from "../../../components/headLayout";
import CategoryList from "../../../components/admin/category/categoryList";
import CategoryForm from "../../../components/admin/category/categoryForm";

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

const Categories = () => {
    const classes = useStyles();
    const { data: categories } = useSWR<ICategory[]>("/categories");
    const [isAdd, setAdd] = useState<boolean>(false);

    const closeAdd = () => {
        setAdd(false);
    };

    const openAdd = () => {
        setAdd(true);
    };

    return (
        <>
            <HeadLayout title="Admin Category" />
            <AdminLayout access="is_admin">
                <div style={{ width: "100%" }}>
                    <Box
                        className={classes.head}
                        display="flex"
                        flexDirection="column"
                    >
                        <Box display="flex" flexDirection="row">
                            <Box flexGrow={1} style={{ marginBottom: "30px" }}>
                                <Typography variant="h5">Categories</Typography>
                            </Box>
                            <Box>
                                <Button
                                    startIcon={<Add />}
                                    variant="contained"
                                    type="button"
                                    onClick={openAdd}
                                    color="primary"
                                >
                                    add category
                                </Button>
                            </Box>
                        </Box>
                        <div>
                            <CategoryList categories={categories} />
                        </div>
                    </Box>
                </div>
                {isAdd && (
                    <CategoryForm
                        categoryLength={categories.length + 1}
                        close={closeAdd}
                    />
                )}
            </AdminLayout>
        </>
    );
};

export default Categories;

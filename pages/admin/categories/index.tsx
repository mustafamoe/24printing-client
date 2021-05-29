import { Box, Typography, Button } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { useState } from "react";

// components
import AdminLayout from "../../../components/admin/adminLayout";
import HeadLayout from "../../../components/headLayout";
import CategoryList from "../../../components/admin/category/categoryList";
import CategoryForm from "../../../components/admin/category/categoryForm";

const Categories = () => {
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
                    <Box display="flex" flexDirection="column">
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
                            <CategoryList />
                        </div>
                    </Box>
                </div>
                {isAdd && <CategoryForm close={closeAdd} />}
            </AdminLayout>
        </>
    );
};

export default Categories;

import { Box, Typography, Button } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { useState } from "react";

// components
import AdminLayout from "../../../components/admin/adminLayout";
import HeadLayout from "../../../components/headLayout";
import SubCategoryList from "../../../components/admin/subCategory/subCategoryList";
import SubCategoryForm from "../../../components/admin/subCategory/subCategoryForm";

const SubCategories = () => {
    const [isAdd, setAdd] = useState<boolean>(false);

    const closeAdd = () => {
        setAdd(false);
    };

    const openAdd = () => {
        setAdd(true);
    };

    return (
        <>
            <HeadLayout title="Admin Sub Category" />
            <AdminLayout>
                <div style={{ width: "100%" }}>
                    <Box display="flex" flexDirection="column">
                        <Box display="flex" flexDirection="row">
                            <Box flexGrow={1} style={{ marginBottom: "30px" }}>
                                <Typography variant="h5">
                                    Sub categories
                                </Typography>
                            </Box>
                            <Box>
                                <Button
                                    startIcon={<Add />}
                                    variant="contained"
                                    type="button"
                                    onClick={openAdd}
                                    color="primary"
                                >
                                    add sub category
                                </Button>
                            </Box>
                        </Box>
                        <div>
                            <SubCategoryList />
                        </div>
                    </Box>
                </div>
                {isAdd && <SubCategoryForm close={closeAdd} />}
            </AdminLayout>
        </>
    );
};

export default SubCategories;

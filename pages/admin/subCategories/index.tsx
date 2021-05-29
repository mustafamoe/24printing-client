import { Box, Typography } from "@material-ui/core";

// components
import AdminLayout from "../../../components/admin/adminLayout";
import HeadLayout from "../../../components/headLayout";
import SubCategoryList from "../../../components/admin/subCategory/subCategoryList";

const SubCategories = () => {
    return (
        <>
            <HeadLayout title="Admin Sub Category" />
            <AdminLayout access="is_admin">
                <div style={{ width: "100%" }}>
                    <Box display="flex" flexDirection="column">
                        <Box display="flex" flexDirection="row">
                            <Box flexGrow={1} style={{ marginBottom: "30px" }}>
                                <Typography variant="h5">
                                    Sub categories
                                </Typography>
                            </Box>
                        </Box>
                        <div>
                            <SubCategoryList />
                        </div>
                    </Box>
                </div>
            </AdminLayout>
        </>
    );
};

export default SubCategories;

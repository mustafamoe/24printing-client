import { Box, Typography } from "@material-ui/core";

// components
import AdminLayout from "../../../components/admin/adminLayout";
import HeadLayout from "../../../components/headLayout";
import UserList from "../../../components/admin/user/userList";

const Users = () => {
    return (
        <>
            <HeadLayout title="Admin Users" />
            <AdminLayout>
                <div style={{ width: "100%" }}>
                    <Box display="flex" flexDirection="column">
                        <Box display="flex" flexDirection="row">
                            <Box flexGrow={1} style={{ marginBottom: "30px" }}>
                                <Typography variant="h5">Users</Typography>
                            </Box>
                        </Box>
                        <div>
                            <UserList />
                        </div>
                    </Box>
                </div>
            </AdminLayout>
        </>
    );
};

export default Users;

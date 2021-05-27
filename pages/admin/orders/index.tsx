import { Box, Typography, Button } from "@material-ui/core";

// components
import AdminLayout from "../../../components/admin/adminLayout";
import HeadLayout from "../../../components/headLayout";
import OrderList from "../../../components/admin/order/orderList";

const Orders = () => {
    return (
        <>
            <HeadLayout title="Admin Orders" />
            <AdminLayout>
                <div style={{ width: "100%" }}>
                    <Box display="flex" flexDirection="column">
                        <Box display="flex" flexDirection="row">
                            <Box flexGrow={1} style={{ marginBottom: "30px" }}>
                                <Typography variant="h5">Orders</Typography>
                            </Box>
                        </Box>
                        <div>
                            <OrderList />
                        </div>
                    </Box>
                </div>
            </AdminLayout>
        </>
    );
};

export default Orders;

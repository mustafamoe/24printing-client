// components
import AdminLayout from "../../../components/admin/adminLayout";
import HeadLayout from "../../../components/headLayout";
import OrderDetails from "../../../components/admin/order/orderDetails";
import useSwr from "swr";
import { IOrder } from "../../../types/order";
import { useSelector } from "react-redux";
import { RootReducer } from "../../../store/reducers";
import { useRouter } from "next/router";
import ErrorPage from "next/error";

const Order = () => {
    const router = useRouter();
    const user = useSelector((state: RootReducer) => state.auth.user);
    const { data: order, error } = useSwr<IOrder>(
        user ? `/order/${router.query.orderId}?authId=${user.user_id}` : null
    );

    if (error && !order) return <ErrorPage statusCode={404} />;
    return (
        <>
            <HeadLayout title={order?.order_id || "Admin order"} />
            <AdminLayout access="is_accountant">
                {order && <OrderDetails order={order} />}
            </AdminLayout>
        </>
    );
};

export default Order;

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import useSWR from "swr";

// components
import Loader from "../loader";
import OrderItem from "./orderItem";
import OrderDetails from "../admin/order/orderDetails";
import { IOrder } from "../../types/order";
import { RootReducer } from "../../store/reducers";
import Modal from "../admin/modal";

const OrderList = () => {
    const user = useSelector((state: RootReducer) => state.auth.user);
    const { data: orders } = useSWR<IOrder[]>(`/orders?authId=${user.user_id}`);
    const [tmpOrders, setOrders] = useState([]);
    const [activeTab, setTab] = useState("active");
    const [showDetails, setDetails] = useState(null);
    const [active, setActive] = useState(null);

    const toggleOrderDetails = (order) => {
        if (showDetails) {
            document.body.style.overflow = "auto";
            setDetails(null);
        } else {
            document.body.style.overflow = "hidden";
            setDetails(order);
        }
    };

    useEffect(() => {
        if (orders && orders.length) {
            if (activeTab === "active") {
                setOrders(
                    ([...orders] as any).filter(
                        (o) =>
                            o.status !== "declined" && o.status !== "canceled"
                    )
                );
            }

            if (activeTab === "archived") {
                setOrders(
                    ([...orders] as any).filter(
                        (o) =>
                            o.status === "declined" || o.status === "canceled"
                    )
                );
            }
        }
    }, [orders]);

    useEffect(() => {
        if (orders && orders.length) {
            if (activeTab === "active") {
                setOrders(
                    ([...orders] as any).filter(
                        (o) =>
                            o.status !== "declined" && o.status !== "canceled"
                    )
                );
            }

            if (activeTab === "archived") {
                setOrders(
                    ([...orders] as any).filter(
                        (o) =>
                            o.status === "declined" || o.status === "canceled"
                    )
                );
            }
        }
    }, [activeTab]);

    const handleTab = (tab) => {
        setTab(tab);
    };

    return (
        <>
            <div className="order-container">
                <div className="order-tabs-container">
                    <div
                        style={
                            activeTab === "active"
                                ? {
                                      backgroundColor: "rgb(236, 0, 140)",
                                      color: "white",
                                  }
                                : null
                        }
                        onClick={() => handleTab("active")}
                        className="order-tab-container"
                    >
                        <p className="order-tab-text">active</p>
                    </div>
                    <div
                        style={
                            activeTab === "archived"
                                ? {
                                      backgroundColor: "rgb(236, 0, 140)",
                                      color: "white",
                                  }
                                : null
                        }
                        onClick={() => handleTab("archived")}
                        className="order-tab-container"
                    >
                        <p className="order-tab-text">archived / completed</p>
                    </div>
                </div>
                {!orders ? (
                    <div style={{ marginTop: "30px" }}>
                        <Loader />
                    </div>
                ) : !tmpOrders.length ? (
                    <div className="no-orders-msg-container">
                        <p className="no-orders-msg">
                            You don't have any orders yet.
                        </p>
                    </div>
                ) : (
                    <div className="orders-list">
                        {tmpOrders.map((order) => (
                            <OrderItem
                                key={order.order_id}
                                active={active}
                                setActive={setActive}
                                toggleOrderDetails={toggleOrderDetails}
                                order={order}
                            />
                        ))}
                    </div>
                )}
            </div>
            {showDetails && (
                <Modal
                    width={60}
                    closeInfo={{ close: toggleOrderDetails, check: false }}
                    type="parent"
                >
                    <OrderDetails order={showDetails} />
                </Modal>
            )}
        </>
    );
};

export default OrderList;

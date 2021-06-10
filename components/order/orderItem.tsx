import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import dateFormat from "dateformat";
import { mutate } from "swr";
import { RootReducer } from "../../store/reducers";
import { apiCall } from "../../utils/apiCall";
import { IOrder } from "../../types/order";

const OrderItem = ({ order, toggleOrderDetails, active, setActive }) => {
    const controls = useRef(null);
    const dispatch = useDispatch();
    const [isExpired, setExpired] = useState(false);
    const user = useSelector((state: RootReducer) => state.auth.user);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<string>("");
    const [state, setState] = useState({
        d: 0,
        h: 0,
        m: 0,
        s: 0,
    });

    useEffect(() => {
        const body = document.getElementsByTagName("body")[0];
        if (body) body.addEventListener("click", handleCloseControls);

        return () => {
            body.removeEventListener("click", handleCloseControls);
        };
    }, []);

    const handleCloseControls = () => {
        if (controls.current) {
            controls.current.style.display = "none";
        }
    };

    const handleOpenControls = (e) => {
        if (controls.current) {
            if (controls.current.style.display === "flex")
                return (controls.current.style.display = "none");
            controls.current.style.display = "flex";
            setActive(order._id);
        }
        e.stopPropagation();
    };

    useEffect(() => {
        if (controls.current) {
            if (active === order._id) return;
            controls.current.style.display = "none";
        }
    }, [active]);

    const statusColors = {
        reviewing: { backgroundColor: "#FF4F53", color: "white" },
        approved: { backgroundColor: "#FFC700", color: "white" },
        "under process": { backgroundColor: "#008ADC", color: "white" },
        "ready to ship": { backgroundColor: "#00CE88", color: "white" },
        completed: { backgroundColor: "#CE488F", color: "white" },
    };

    const handleCancelOrder = async () => {
        try {
            setLoading(true);

            await apiCall(
                "post",
                `/order/${order.order_id}/cancel?authId=${user.user_id}`
            );

            mutate(`/orders?authId=${user.user_id}`, (orders: IOrder[]) => {
                return orders.map((o) =>
                    o.order_id === order.order_id
                        ? { ...o, status: "canceled" }
                        : o
                );
            });

            setLoading(false);
        } catch (err) {
            setLoading(false);
        }
    };

    useEffect(() => {
        var countDownDate = new Date(order.expected_date).getTime();

        var now = new Date().getTime();

        var distance = countDownDate - now;

        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (distance > 0) {
            setState({ d: days, h: hours, m: minutes, s: seconds });
        } else {
            setExpired(true);
        }

        const x = setInterval(function () {
            var now = new Date().getTime();

            var distance = countDownDate - now;

            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor(
                (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            var minutes = Math.floor(
                (distance % (1000 * 60 * 60)) / (1000 * 60)
            );
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if (distance > 0) {
                setState({ d: days, h: hours, m: minutes, s: seconds });
            } else {
                setExpired(true);
            }
        }, 1000);

        return () => {
            clearInterval(x);
        };
    }, []);

    return (
        <div className="order-item">
            <div className="order-item-head-container">
                <div>
                    <p className="order-item-amount">
                        {parseFloat(String(order.charge.amount / 100)).toFixed(
                            2
                        )}{" "}
                        AED
                    </p>
                </div>
                <div>
                    <p>{dateFormat(order.created_at, "MM/dd/yyyy")}</p>
                </div>
                <div className="order-expected-date-container">
                    {!isExpired ? (
                        <>
                            <div className="order-expected-date-item">
                                <p className="order-expected-date-text">
                                    d
                                    <span className="order-timer-text">
                                        {state.d}
                                    </span>
                                </p>
                            </div>
                            <div className="order-expected-date-item">
                                <p className="order-expected-date-text">
                                    h
                                    <span className="order-timer-text">
                                        {state.h}
                                    </span>
                                </p>
                            </div>
                            <div className="order-expected-date-item">
                                <p className="order-expected-date-text">
                                    m
                                    <span className="order-timer-text">
                                        {state.m}
                                    </span>
                                </p>
                            </div>
                            <div className="order-expected-date-item">
                                <p className="order-expected-date-text">
                                    s
                                    <span className="order-timer-text">
                                        {state.s}
                                    </span>
                                </p>
                            </div>
                        </>
                    ) : (
                        "Done!"
                    )}
                </div>
                <div className="order-status-container">
                    <div
                        style={statusColors[order.status]}
                        className="order-status-content-container"
                    >
                        <p className="order-status-content-text">
                            {order.status}
                        </p>
                    </div>
                </div>
                <div className="order-controls-container">
                    <div
                        onClick={handleOpenControls}
                        className="order-dots-container"
                    >
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                    </div>
                    <div ref={controls} className="order-controls-btns-wrapper">
                        <button
                            type="button"
                            className="order-control-btn"
                            onClick={() => toggleOrderDetails(order)}
                        >
                            details
                        </button>
                        <button type="button" className="order-control-btn">
                            reorder
                        </button>
                        <button
                            type="button"
                            className="order-control-btn order-cancel-btn"
                            onClick={handleCancelOrder}
                        >
                            cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderItem;

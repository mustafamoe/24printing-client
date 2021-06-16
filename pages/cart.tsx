import { clearCart } from "../store/actions/cart";
import { useDispatch } from "react-redux";
import useCart from "../hooks/useCart";
import Link from "next/link";
import CartList from "../components/cart/cartList";
import { useEffect } from "react";
import { clearProducts } from "../store/actions/checkout";

// components
import Summary from "../components/cart/summary";
import ImageOpt from "../components/imageOpt";
import HeadLayout from "../components/headLayout";
import Loader from "../components/loader";

const Cart = () => {
    const [cart, loading] = useCart();
    const dispatch = useDispatch();

    const handleClearCart = () => {
        dispatch(clearCart());
    };

    useEffect(() => {
        dispatch(clearProducts());
    }, []);

    return (
        <>
            <HeadLayout title="Cart" />
            {!cart.length ? (
                <div className="cart-empty-container">
                    <div className="cart-empty-img-container">
                        <ImageOpt
                            className="cart-empty-img"
                            src="/emptyCart.gif"
                            alt="empty cart"
                            location="local"
                            width={500}
                            height={281}
                        />
                        <Link href="/shop">
                            <a className="cart-empty-gts">shop now !</a>
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="cart-page">
                    {loading ? (
                        <div className="cart-loading-container">
                            <Loader />
                        </div>
                    ) : (
                        <>
                            <div className="cart-page-products-container">
                                <div className="cart-page-heading-container">
                                    <p className="cart-heading">
                                        shopping cart
                                    </p>
                                    <button
                                        type="button"
                                        style={{ marginTop: "10px" }}
                                        className="button delete-btn"
                                        onClick={handleClearCart}
                                    >
                                        clear cart
                                    </button>
                                </div>
                                <CartList cart={cart} />
                            </div>
                            <div className="cart-summary-container">
                                <Summary cart={cart} />
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
};

export default Cart;

import { useState } from "react";
import useCart from "../hooks/useCart";
import WithSignin from "../hocs/withSignin";
import { useRouter } from "next/router";

// components
import Summary from "../components/cart/summary";
import CheckoutForm from "../components/checkout/checkoutForm";
import SuccessModal from "../components/checkout/successModal";
import HeadLayout from "../components/headLayout";

const Checkout = () => {
    const router = useRouter();
    const [cart] = useCart();
    const [showModel, setModel] = useState(false);
    const [state, setState] = useState({
        email: "",
        name: "",
        phone: "",
        address_line1: "",
        address_line2: "",
        address_city: "Abu Dhabi City",
        address_zip: "",
        address_country: "UAE",
    });

    const openModel = () => {
        document.body.style.overflow = "hidden";
        setModel(true);
    };

    const redirectShop = () => {
        router.push("/shop");
    };

    return (
        <>
            <HeadLayout title="Checkout" />
            <WithSignin>
                <div className="checkout-page">
                    <CheckoutForm
                        state={state}
                        setState={setState}
                        openModal={openModel}
                    />
                    <div className="checkout-summary-container">
                        <Summary
                            city={state.address_city}
                            cart={cart}
                            type="checkout"
                        />
                    </div>
                </div>
                {showModel ? <SuccessModal close={redirectShop} /> : null}
            </WithSignin>
        </>
    );
};

export default Checkout;

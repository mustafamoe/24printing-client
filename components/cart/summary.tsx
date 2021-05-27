import React from "react";
import Link from "next/link";

interface IProps {
    cart: any;
    type?: any;
}

const Summary = ({ cart, type }: IProps) => {
    const summeryContent = () => {
        let jsx = [];
        let totalPrice = 0;
        let discountPrice = 0;
        let customizationsPrice = 0;

        cart.forEach((item) => {
            totalPrice += item.quantity?.price;

            if (item.product.discount) {
                if (new Date() > new Date(item.product.discount.duration)) {
                    const price = item.product.discount.quantities.find(
                        (q) =>
                            String(q.quantity_id) ===
                            String(item.quantity?.quantity_id)
                    );

                    console.log(price);

                    if (price)
                        discountPrice += item.quantity?.price - price.price;
                }
            }

            item.customizations.forEach((customization) => {
                if (customization.type === "dropdown") {
                    if (customization.dropdown) {
                        const price = customization.dropdown.prices.find(
                            (p) =>
                                String(p.quantity_id) ===
                                String(item.quantity?.quantity_id)
                        );
                        if (price) {
                            customizationsPrice += Number(price.price);
                        }
                    }
                } else if (customization.type === "card") {
                    if (customization.card) {
                        const price = customization.card.prices.find(
                            (p) =>
                                String(p.quantity_id) ===
                                String(item.quantity?.quantity_id)
                        );
                        if (price) {
                            customizationsPrice += Number(price.price);
                        }
                    }
                }
            });
        });

        jsx.push(
            <div key={0} className="summary-content-item">
                <p className="summary-content-text">
                    subtotal (Excl. customizations) {totalPrice} AED
                </p>
            </div>
        );

        totalPrice = totalPrice + customizationsPrice;
        jsx.push(
            <div key={1} className="summary-content-item">
                <p className="summary-content-text">
                    subtotal (Incl. customizations) {totalPrice} AED
                </p>
            </div>
        );

        jsx.push(
            <div key={2} className="summary-content-item">
                <p className="summary-content-text">
                    Discount {discountPrice} AED
                </p>
            </div>
        );

        jsx.push(
            <div key={3} className="summary-content-item">
                <p className="summary-content-text">
                    Grand total (Excl. VAT){" "}
                    {Number(totalPrice) - Number(discountPrice)} AED
                </p>
            </div>
        );

        jsx.push(
            <div key={4} className="summary-content-item">
                <p className="summary-content-text">
                    VAT{" "}
                    {parseFloat(
                        String(
                            (Number(totalPrice) - Number(discountPrice)) * 0.05
                        )
                    ).toFixed(2)}{" "}
                    AED
                </p>
            </div>
        );

        jsx.push(
            <div key={5} className="summary-content-item">
                <p className="summary-content-text">
                    Grand total (Incl. VAT){" "}
                    <span className="summary-total-price">
                        {parseFloat(
                            String(
                                Number(totalPrice) -
                                    Number(discountPrice) +
                                    (Number(totalPrice) -
                                        Number(discountPrice)) *
                                        0.05
                            )
                        ).toFixed(2)}{" "}
                        AED
                    </span>
                </p>
            </div>
        );

        return jsx;
    };

    if (cart)
        return (
            <div className="summary-wrapper">
                <div className="summary-container">
                    <div className="summary-heading-container">
                        <p className="summary-heading">summary</p>
                    </div>
                    <div className="summary-content-container">
                        {summeryContent()}
                    </div>
                    {type !== "checkout" ? (
                        <div className="checkout-btn-container">
                            <Link href="/checkout">
                                <a className="button checkout-btn">
                                    proceed to check out
                                </a>
                            </Link>
                        </div>
                    ) : null}
                </div>
            </div>
        );
    return null;
};

export default Summary;

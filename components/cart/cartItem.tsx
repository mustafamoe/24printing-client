import React from "react";
import { useDispatch } from "react-redux";
import {
    removeProductCart,
    changeProductQtyCart,
} from "../../store/actions/cart";
import Link from "next/link";
import ImageOpt from "../imageOpt";

const CartProductItem = ({ product }) => {
    const dispatch = useDispatch();

    console.log(product);
    const handleRemoveCartProduct = () => {
        dispatch(removeProductCart(product.product_id));
    };

    const handleCartProductQty = (e) => {
        const quantity = product.product.quantities.find(
            (q) => q.quantity_id === e.target.value
        );

        if (quantity)
            dispatch(changeProductQtyCart(product.product_id, quantity));
    };

    const productCustomizationsAds = () => {
        let jsx = [];
        let adsCounter = 0;
        let totlaPrice = Number(product.quantity?.price);
        const div = (name, price, id) => {
            jsx.push(
                <div
                    key={id}
                    className="product-details-qty-customizations-ad-container"
                >
                    <p className="product-details-qty-customizations-ad">
                        + {price} AED from {name}
                    </p>
                </div>
            );
        };

        product.customizations.forEach((customization) => {
            if (customization.type === "cards") {
                if (customization.option) {
                    const name = customization.name;
                    const qty = customization.option.prices.find(
                        (p) => p._id === product.quantity._id
                    );
                    if (qty) {
                        totlaPrice += Number(qty.price);
                        adsCounter++;
                        return div(name, qty.price, customization._id);
                    }
                }
            } else if (customization.type === "dropDown") {
                if (customization.dropDownOption) {
                    const name = customization.name;
                    const qty = customization.dropDownOption.prices.find(
                        (p) => p._id === product.quantity._id
                    );
                    if (qty) {
                        totlaPrice += Number(qty.price);
                        adsCounter++;
                        return div(name, qty.price, customization._id);
                    }
                }
            }
        });

        if (adsCounter)
            return (
                <>
                    <div className="product-details-qty-item product-details-qty-customizations-ad-container">
                        {jsx}
                    </div>
                    <div className="product-details-qty-item">
                        <p className="product-details-qty-total-price-text">
                            {parseFloat(String(totlaPrice)).toFixed(2)} AED
                        </p>
                    </div>
                </>
            );
    };

    if (product.product)
        return (
            <div className="cart-product-item">
                <div className="cart-product-content-container">
                    <div className="cart-product-img-container">
                        <ImageOpt
                            className="cart-product-img"
                            src={product.product.image.image_name}
                            alt=""
                            layout="fill"
                            objectFit="contain"
                        />
                    </div>
                    <div className="cart-product-text-container">
                        <div className="cart-product-name-container">
                            <Link
                                href={`/product/${product.product.product_name}`}
                            >
                                <a className="cart-product-name">
                                    {product.product.product_name}
                                </a>
                            </Link>
                        </div>
                        <div className="cart-product-controls">
                            <div className="cart-product-qty-container">
                                <select
                                    className="form-input cart-product-qty"
                                    value={product.quantity?.quantity_id}
                                    onChange={handleCartProductQty}
                                >
                                    {product.product.quantities.map(
                                        (quantity) => (
                                            <option
                                                key={quantity.quantity_id}
                                                value={quantity.quantity_id}
                                            >
                                                {quantity.qty}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>
                            <div className="cart-product-delete-container">
                                <button
                                    type="button"
                                    className="cart-product-delete-btn"
                                    onClick={handleRemoveCartProduct}
                                >
                                    <ImageOpt
                                        src="/trash (1).svg"
                                        alt="delete"
                                        location="local"
                                        layout="fill"
                                        objectFit="contain"
                                        className="cart-product-delete-icon"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="cart-product-price-ads-container">
                    {product.designImage && (
                        <div className="cart-product-design-image-container">
                            <p className="cart-product-design-text">
                                your design
                            </p>
                            <div className="cart-product-design-image-wrapper">
                                <img
                                    className="cart-product-design-image"
                                    src={product.designImage}
                                    alt="product design"
                                />
                            </div>
                        </div>
                    )}
                    <div className="cart-product-customization-price-details">
                        <p className="cart-product-customizations-text">
                            customizations
                        </p>
                        <div className="cart-product-price-container">
                            <p className="cart-product-price">
                                {product.quantity?.price} AED
                            </p>
                        </div>
                        <div className="cart-product-ads-container">
                            {productCustomizationsAds()}
                        </div>
                    </div>
                </div>
            </div>
        );
    return null;
};

export default CartProductItem;

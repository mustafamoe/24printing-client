import React, { useState } from "react";
import { clearWishlist } from "../store/actions/wishlist";
import { useDispatch } from "react-redux";
import Link from "next/link";
import useWishlist from "../hooks/useWishlist";

// components
import ProductItem from "../components/product/productItem";
import Loader from "../components/loader";
import ProductQuikView from "../components/product/productQuikView";

const Wishlist = () => {
    const wishlist = useWishlist();
    const [quikView, setQuikView] = useState(null);
    const dispatch = useDispatch();
    const handleClearWishlist = () => {
        dispatch(clearWishlist());
    };

    const toggleQuikView = (product) => {
        if (quikView) {
            document.documentElement.style.overflow = "auto";
            setQuikView(null);
        } else {
            document.documentElement.style.overflow = "hidden";
            setQuikView(product);
        }
    };

    if (!wishlist.length)
        return (
            <div className="wishlist-empty-container">
                <div className="wishlist-empty-img-container">
                    <img
                        className="wishlist-empty-img"
                        src="/empty_wishlist.jpg"
                        alt="empty wishlist"
                    />
                    <Link href="/shop">
                        <a className="wishlist-empty-gts">shop now !</a>
                    </Link>
                </div>
            </div>
        );
    return (
        <>
            <div className="wishlist-page">
                {false ? (
                    <div className="wishlist-loading-container">
                        <Loader />
                    </div>
                ) : (
                    <>
                        <div className="wishlist-page-products-container">
                            <div className="wishlist-page-heading-container">
                                <p className="wishlist-heading">
                                    shopping wishlist
                                </p>
                                <button
                                    type="button"
                                    style={{ marginTop: "10px" }}
                                    className="button delete-btn"
                                    onClick={handleClearWishlist}
                                >
                                    clear wishlist
                                </button>
                            </div>
                            <div className="wishlist-products-container">
                                {wishlist.map((p) => (
                                    <ProductItem
                                        toggleProductModal={toggleQuikView}
                                        key={p.product_id}
                                        type="wishlist"
                                        product={p}
                                    />
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
            {quikView && (
                <ProductQuikView product={quikView} close={toggleQuikView} />
            )}
        </>
    );
};

export default Wishlist;

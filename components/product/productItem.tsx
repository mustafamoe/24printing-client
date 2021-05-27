import { useState } from "react";
import {
    addProductWishlist,
    removeProductWishlist,
} from "../../store/actions/wishlist";
import { useDispatch } from "react-redux";
import ImageOpt from "../imageOpt";
// import useDiscount from "../../hooks/useDiscount";
import Link from "next/link";
import SearchIcon from "@material-ui/icons/Search";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import FavoriteIcon from "@material-ui/icons/Favorite";

// components
import Rating from "./rating";
import { IProduct } from "../../types/product";

interface IProps {
    product: IProduct;
    toggleProductModal: any;
    type?: "wishlist";
}

const ProductItem = ({ product, toggleProductModal, type }: IProps) => {
    const [isHover, setIsHover] = useState(false);
    const date = new Date().getTime() - new Date(product.created_at).getTime();
    const isNewlyReleased = Math.floor(date / (1000 * 60 * 60 * 24)) < 30;
    const handleOver = () => setIsHover(true);
    const handleMouseOut = () => setIsHover(false);
    const dispatch = useDispatch();
    const style = {
        bottom: "10px",
    };

    const handleWishlist = () => {
        if (type === "wishlist")
            return dispatch(removeProductWishlist(product.product_id));
        dispatch(addProductWishlist(product.product_id));
    };

    const newlyReleasedJsx = () => {
        if (isNewlyReleased)
            return (
                <div className="product-item-nlr-container">
                    <p className="product-item-nlr-text">new</p>
                </div>
            );
    };

    const discountJsx = () => {
        if (product.discount)
            return (
                <div className="product-item-discount-container">
                    <p className="product-item-discount-text">sale!</p>
                </div>
            );
    };

    if (product)
        return (
            <div
                className="product-item-container"
                onMouseOver={handleOver}
                onMouseLeave={handleMouseOut}
            >
                <div className="product-item-img-container">
                    <Link href={`/product/${product.product_name}`}>
                        <a className="product-item-image-link">
                            <div className="product-item-image-wrapper">
                                {product.showcase?.length ? (
                                    <ImageOpt
                                        className="product-item-image"
                                        src={
                                            isHover
                                                ? product.showcase[0]
                                                      ?.image_name
                                                : product.image?.image_name
                                        }
                                        objectFit="contain"
                                        layout="fill"
                                    />
                                ) : (
                                    <ImageOpt
                                        className="product-item-image"
                                        src={product.image?.image_name}
                                        objectFit="contain"
                                        layout="fill"
                                    />
                                )}
                            </div>
                            {!product.is_published ? (
                                <div className="disabled-container">
                                    <ImageOpt
                                        className="disabled-container-img"
                                        location="local"
                                        src={"/block (1).svg"}
                                        alt="blocked"
                                        width={200}
                                        height={200}
                                    />
                                </div>
                            ) : null}
                        </a>
                    </Link>
                    <div
                        className="product-item-hover-elements"
                        style={isHover ? style : null}
                    >
                        <div
                            className="product-item-quik-view-container"
                            title="quick view"
                        >
                            <button
                                type="button"
                                className="product-item-quik-view-btn"
                                onClick={() => toggleProductModal(product)}
                            >
                                <SearchIcon className="product-item-icons" />
                            </button>
                        </div>
                        <div
                            className="product-item-showmore-container"
                            title="shop now"
                        >
                            <Link href={`/product/${product.product_name}`}>
                                <a className="shop-product-show-more-btn">
                                    <ShoppingCartIcon className="product-item-icons" />
                                </a>
                            </Link>
                        </div>
                        <div
                            className="product-item-wishtlist-container"
                            title={
                                type === "wishlist"
                                    ? "Remove from wishlist"
                                    : "wishlist"
                            }
                        >
                            <button
                                type="button"
                                className="product-item-wishlist-btn"
                                onClick={handleWishlist}
                            >
                                <FavoriteIcon className="product-item-icons" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="product-item-content">
                    <Link href={`/product/${product.product_name}`}>
                        <a className="product-item-name">
                            {product.product_name}
                        </a>
                    </Link>
                    <p className="product-item-price">
                        {!product.discount ? (
                            product.quantities[0]?.price + " AED"
                        ) : (
                            <>
                                <span className="product-item-pre-dis-price">
                                    {product.quantities[0]?.price} AED
                                </span>
                                <span className="product-item-dis-price">
                                    {product.discount.quantities[0]?.price} AED
                                </span>
                            </>
                        )}
                    </p>
                    <Rating rating={product.rating} reviews={product.reviews} />
                </div>
                <div className="product-items-info">
                    {discountJsx()}
                    {newlyReleasedJsx()}
                </div>
                {product.is_eligible ? (
                    <div className="product-item-24-container">
                        <div className="product-item-24-icon">
                            <p>24</p>
                            <p>days</p>
                        </div>
                    </div>
                ) : null}
            </div>
        );
};

export default ProductItem;

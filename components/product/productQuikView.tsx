import { useEffect } from "react";
import Link from "next/link";
import ImageOpt from "../imageOpt";

// components
import Modal from "../modal";
import Rating from "../product/rating";
import { IProduct } from "../../types/product";

interface IProps {
    product: IProduct;
    close: any;
}

const ProductQuikView = ({ product, close }: IProps) => {
    useEffect(() => {
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    const handleClose = () => close();

    if (product)
        return (
            <Modal close={close} style={{ width: "60%" }}>
                <div className="product-quik-view-container">
                    <div className="product-quik-view-img-container">
                        <Link href={`/product/${product.product_name}`}>
                            <a>
                                <ImageOpt
                                    src={product.image?.image_name}
                                    layout="fill"
                                    objectFit="contain"
                                />
                            </a>
                        </Link>
                    </div>
                    <div className="product-quik-view-content">
                        <div className="product-quik-view-item">
                            <Link href={`/product/${product.product_name}`}>
                                <a className="product-quik-view-name">
                                    {product.product_name}
                                </a>
                            </Link>
                        </div>
                        <div className="product-quik-view-item">
                            <p className="product-quik-view-price">
                                starting at{" "}
                                <span className="product-quik-view-price-text">
                                    {product.quantities[0].price} AED
                                </span>
                            </p>
                        </div>
                        <div className="product-quik-view-item product-quik-view-category">
                            {product.sub_category && product.category ? (
                                <Link
                                    href={`/shop?category=${product.category.category_id}&sub_category=${product.sub_category.sub_category_id}`}
                                >
                                    <a
                                        className="product-quik-view-category"
                                        onClick={handleClose}
                                    >
                                        {product.category.category_name} -{" "}
                                        {product.sub_category.sub_category_name}
                                    </a>
                                </Link>
                            ) : product.category ? (
                                <Link
                                    href={`/shop?category=${product.category.category_id}`}
                                >
                                    <a
                                        onClick={handleClose}
                                        className="product-quik-view-category"
                                    >
                                        {product.category.category_name}
                                    </a>
                                </Link>
                            ) : null}
                        </div>
                        <div className="product-quik-view-item">
                            <Rating
                                rating={product.rating}
                                reviews={product.reviews}
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        );
};

export default ProductQuikView;

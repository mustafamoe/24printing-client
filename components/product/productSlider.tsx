import React, { useState, useEffect } from "react";
import SwiperCore, { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { IProduct } from "../../types/product";

// components
import ProductItem from "./productItem";

// install Swiper components
SwiperCore.use([Navigation, Pagination]);

interface IProps {
    products: IProduct[];
    slidesPerView: number;
    toggleProductModal: any;
}

const ProductsSlider = ({
    products,
    slidesPerView,
    toggleProductModal,
}: IProps) => {
    const [isActive, setActive] = useState(true);

    useEffect(() => {
        if (isActive) {
            setActive(false);
            setTimeout(() => {
                setActive(true);
            }, 1);
        }
    }, [location, products]);

    if (isActive)
        return (
            <div className="product-item-swiper-container">
                <div className="product-item-main-swiper-container">
                    <Swiper
                        autoHeight={true}
                        slidesPerGroup={1}
                        spaceBetween={20}
                        slidesPerView={slidesPerView}
                        breakpoints={{
                            0: {
                                slidesPerView: 1,
                            },
                            730: {
                                slidesPerView: 2,
                            },
                            1100: {
                                slidesPerView: 3,
                            },
                            1450: {
                                slidesPerView: 4,
                            },
                        }}
                    >
                        {products.map((product) => (
                            <SwiperSlide key={product.product_id}>
                                <ProductItem
                                    toggleProductModal={toggleProductModal}
                                    product={product}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        );
    return null;
};

export default ProductsSlider;

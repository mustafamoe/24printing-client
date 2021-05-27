import { useState, useEffect } from "react";
import SwiperCore, { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { IImage } from "../../types/image";
import ImageOpt from "../imageOpt";
import { useRouter } from "next/router";

// install Swiper components
SwiperCore.use([Navigation, Pagination]);

interface IProps {
    images: IImage[];
    discount: boolean;
    isNewlyReleased: boolean;
}

const ShowcaseSlider = ({ images, discount, isNewlyReleased }: IProps) => {
    const router = useRouter();
    const [slider, setSlider] = useState(null);
    const [isActive, setActive] = useState(true);
    const [activeSlide, setActiveSlide] = useState(0);

    useEffect(() => {
        if (isActive) {
            setActive(false);
            setTimeout(() => {
                setActive(true);
                setActiveSlide(0);
            }, 1);
        }
    }, [router.query]);

    useEffect(() => {
        if (isActive) {
            if (slider) slider.slideTo(activeSlide);
        }
    }, [activeSlide]);

    const handleSlide = (i) => {
        setActiveSlide(i);
    };

    const discountJsx = () => {
        if (discount)
            return (
                <div className="product-item-discount-container">
                    <p className="product-item-discount-text">sale!</p>
                </div>
            );
    };

    const newlyReleasedJsx = () => {
        if (isNewlyReleased)
            return (
                <div className="product-item-nlr-container">
                    <p className="product-item-nlr-text">new</p>
                </div>
            );
    };

    if (isActive)
        return (
            <div className="product-image-swiper-container">
                <div className="product-thumbs-swiper-container">
                    {images.map((image, i) => (
                        <div
                            key={i}
                            style={
                                activeSlide === i
                                    ? {
                                          borderColor: "#ec008c",
                                          boxShadow: "0 0 5px 2px #ec008c",
                                      }
                                    : null
                            }
                            onMouseOver={() => handleSlide(i)}
                            className="product-thumb-img-container"
                        >
                            <ImageOpt
                                className="product-thumb-img"
                                src={image.image_name}
                                alt=""
                                layout="fill"
                                objectFit="contain"
                            />
                        </div>
                    ))}
                </div>
                <div className="product-main-swiper-container">
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={50}
                        onSlideChange={(swiper) =>
                            handleSlide(swiper.activeIndex)
                        }
                        pagination={{ clickable: true }}
                        onSwiper={(swiper) => setSlider(swiper)}
                    >
                        {images.map((image, i) => (
                            <SwiperSlide
                                className="product-slider-img-container"
                                key={image.image_id}
                            >
                                <div className="product-slider-img-wrapper">
                                    <ImageOpt
                                        className="product-thumb-img"
                                        src={image.image_name}
                                        alt=""
                                        layout="fill"
                                        objectFit="contain"
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className="product-items-info">
                        {discountJsx()}
                        {newlyReleasedJsx()}
                    </div>
                </div>
            </div>
        );
    return null;
};

export default ShowcaseSlider;

import { useState, useEffect } from "react";
import parse from "html-react-parser";
import useSwr from "swr";
import { steps } from "../data/steps";
import { useRouter } from "next/router";

// components
import ProductSlider from "../components/product/productSlider";
import ImageOpt from "../components/imageOpt";
import BannerSlider from "../components/banner/bannerSlider";
import ProductQuikView from "../components/product/productQuikView";
import Loader from "../components/loader";
import TestimonialSlider from "../components/home/testimonialSlider";
import { IProduct } from "../types/product";
import { IBanner } from "../types/banner";

const Home = () => {
    const router = useRouter();
    const { data: banners } = useSwr<IBanner[]>("/banners?banner_page=home");
    const { data: products } = useSwr<IProduct[]>("/products");
    const { data: advCards } = useSwr("/adv_cards");
    const [saleProducts, setSaleProducts] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [newlyReleased, setNewlyReleased] = useState([]);
    const [productQuikView, setProductQuikView] = useState(null);
    const [activeStep, setStep] = useState(null);

    useEffect(() => {
        if (products) {
            setSaleProducts(getOnSale(20));
            setFeaturedProducts(getFeaturedProducts(20));
            setNewlyReleased(getNewlyReleasedProducts(20));
        }
    }, [products]);

    const toggleProductModal = (product) => {
        if (productQuikView) {
            document.body.style.overflow = "auto";
            setProductQuikView(null);
        } else {
            document.body.style.overflow = "hidden";
            setProductQuikView(product);
        }
    };

    const getOnSale = (limit) => {
        const productsCopy = [...products];
        let onSale = [];
        let count = 0;

        for (let i = 0; i < productsCopy.length; i++) {
            if (productsCopy[i].discount) {
                if (new Date() > new Date(productsCopy[i].discount.duration)) {
                    onSale.push(productsCopy[i]);
                }
            }
            if (count >= limit) break;
        }

        return onSale;
    };

    const getFeaturedProducts = (limit) => {
        const productCopy = [...products];
        let featured = [];
        let count = 0;

        for (let i = 0; i < productCopy.length; i++) {
            if (productCopy[i].is_featured) {
                featured.push(productCopy[i]);
            }
            if (count >= limit) break;
        }

        return featured;
    };

    const getNewlyReleasedProducts = (limit) => {
        const productCopy = [...products];
        let newlyReleased = [];
        let count = 0;

        for (let i = 0; i < productCopy.length; i++) {
            var date =
                new Date().getTime() -
                new Date(productCopy[i].created_at).getTime();
            if (Math.floor(date / (1000 * 60 * 60 * 24)) < 30) {
                newlyReleased.push(productCopy[i]);
            }
            if (count >= limit) break;
        }

        return newlyReleased;
    };

    return (
        <>
            <div>
                <div style={{ width: "100wv" }}>
                    <BannerSlider page="home" loop={true} banners={banners} />
                </div>
                <div
                    style={{
                        textAlign: "center",
                        width: "70%",
                        margin: "50px auto",
                    }}
                >
                    <h2
                        style={{
                            marginBottom: "20px",
                            fontWeight: 300,
                            color: "#ec008c",
                        }}
                    >
                        Online Printing Services…Next Day Delivery!
                    </h2>
                    <p>
                        We are an Abu Dhabi based print company that offers
                        quality, value and service all in fast delivery service.
                        We are a nationwide, full colour, 24hr printing company
                        and have 1000's of customers who regard us as their
                        trusted printers, providing a wide range of print
                        products which are produced to the highest standard.
                        Order it today… Get it tomorrow, simple! (Saturday
                        Delivery also available){" "}
                    </p>
                </div>
                <div className="home-step-heading-container">
                    <h1 className="home-step-heading">
                        Step by Step Guide to Shop online
                    </h1>
                </div>
                <div className="home-steps-container">
                    {steps.map((step, i) => (
                        <div
                            onMouseOver={() => setStep(i)}
                            onMouseLeave={() => setStep(null)}
                            key={i}
                            className="step-container"
                        >
                            <div className="steps-image-container">
                                <img
                                    style={{ width: "100%" }}
                                    src={steps[i].image}
                                    alt=""
                                />
                            </div>
                            <div className="steps-content-container">
                                <p className="steps-title">{step.title}</p>
                            </div>
                            <div
                                style={
                                    activeStep === i
                                        ? { display: "block" }
                                        : null
                                }
                                className="steps-description-container"
                            >
                                <p className="steps-description">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                {newlyReleased.length ? (
                    <div className="home-product-carousel">
                        <div className="home-category-container">
                            <div className="start-div"></div>
                            <h4 className="home-carousel-header">
                                newly released
                            </h4>
                            <div className="end-div"></div>
                        </div>
                        <ProductSlider
                            toggleProductModal={toggleProductModal}
                            slidesPerView={4}
                            products={newlyReleased}
                        />
                    </div>
                ) : null}
                {!advCards ? (
                    <Loader />
                ) : (
                    <div className="category-container-home">
                        {advCards.map((card, i) => (
                            <div key={i} className="category-box">
                                <div className="category-box-img-container">
                                    <ImageOpt
                                        className="category-image"
                                        src={card.image.image_name}
                                        layout="fill"
                                        objectFit="cover"
                                    />
                                </div>
                                <div className="category-box-content-section">
                                    <p className="home-card-title">
                                        {card.title}
                                    </p>
                                    <div className="home-card-imagedescription">
                                        {parse(card.content)}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => router.push(card.link)}
                                        className="shop-button"
                                    >
                                        shop now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {featuredProducts.length ? (
                    <div className="home-product-carousel">
                        <div className="home-category-container">
                            <div className="start-div"></div>
                            <h4 className="home-carousel-header">
                                featured products
                            </h4>
                            <div className="end-div"></div>
                        </div>
                        <ProductSlider
                            toggleProductModal={toggleProductModal}
                            slidesPerView={4}
                            products={featuredProducts}
                        />
                    </div>
                ) : null}
                {saleProducts.length ? (
                    <div className="home-product-carousel">
                        <div className="home-category-container">
                            <div className="start-div"></div>
                            <h4 className="home-carousel-header">On Sale</h4>
                            <div className="end-div"></div>
                        </div>
                        <ProductSlider
                            toggleProductModal={toggleProductModal}
                            slidesPerView={4}
                            products={saleProducts}
                        />
                    </div>
                ) : null}
                <div></div>
                <div className="">
                    <div>
                        <p className="testimonial-heading">testimonials</p>
                    </div>
                    <div className="testimonial-section">
                        <div className="testimonial-vedio-container">
                            <iframe
                                width="100%"
                                title="youtube video"
                                height="100%"
                                src="https://www.youtube-nocookie.com/embed/UdXVAEYf-3A?autoplay=1&mute=1"
                            ></iframe>
                        </div>
                        <div className="home-testimonial-slider-container">
                            <TestimonialSlider />
                        </div>
                    </div>
                </div>
            </div>
            {productQuikView && (
                <ProductQuikView
                    product={productQuikView}
                    close={toggleProductModal}
                />
            )}
        </>
    );
};

export default Home;

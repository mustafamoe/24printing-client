import SwiperCore, { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { testimonials } from "../../data/testimonials";
import ImageOpt from "../imageOpt";

// install Swiper components
SwiperCore.use([Navigation, Pagination]);

const TestimonialSlider = () => {
    return (
        <div>
            <Swiper
                slidesPerView={1}
                slidesPerGroup={1}
                autoHeight
                spaceBetween={50}
                pagination={{ clickable: true }}
            >
                {testimonials.map((testimonal, i) => (
                    <SwiperSlide
                        key={i}
                        className="product-slider-img-container"
                    >
                        <div className="testimonial-container" key={i}>
                            <div className="testimonial-content-container">
                                <p className="testimonial-content">
                                    <div className="testimonial-quotes-img qoute-start">
                                        <ImageOpt
                                            src="/left-quote.svg"
                                            location="local"
                                            width={20}
                                            height={20}
                                        />
                                    </div>
                                    {testimonal.content}
                                    <div className="testimonial-quotes-img qoute-end">
                                        <ImageOpt
                                            src="/left-quote.svg"
                                            width={20}
                                            height={20}
                                            location="local"
                                        />
                                    </div>
                                </p>
                            </div>
                            <div className="testimonial-name-container">
                                <p className="testimonial-name">
                                    {testimonal.name}
                                </p>
                                <p className="testimonial-title">
                                    {testimonal.title}
                                </p>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default TestimonialSlider;

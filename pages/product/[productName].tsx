import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import parser from "html-react-parser";
import { addProductCart } from "../../store/actions/cart";
import Link from "next/link";
import useSWR from "swr";
import { apiCall, apiImage, domain } from "../../utils/apiCall";
import { IProduct } from "../../types/product";
import { GetServerSideProps } from "next";
import { IQuantity } from "../../types/quantity";
import ErrorPage from "next/error";
import { useRouter } from "next/router";
import {
    FacebookShareButton,
    FacebookIcon,
    WhatsappIcon,
    WhatsappShareButton,
    EmailShareButton,
    EmailIcon,
} from "react-share";

// components
import ProductSlider from "../../components/product/productSlider";
import ShowCaseSlider from "../../components/product/showCaseSlider";
import Rating from "../../components/product/rating";
import CustomerReviews from "../../components/review/customerReviews";
import ReviewList from "../../components/review/reviewList";
import ReviewForm from "../../components/review/reviewForm";
import CustomizationForm from "../../components/product/customizationForm";
import Designer from "../../components/product/designer";
import ActionModal from "../../components/admin/actionModal";
import QuikView from "../../components/product/productQuikView";
import HeadLayout from "../../components/headLayout";

//icons
import CheckIcon from "@material-ui/icons/Check";
import { IReview } from "../../types/reviews";
import { CircularProgress, Box } from "@material-ui/core";

interface IProps {
    product: IProduct;
}

interface IState {
    quantity: IQuantity | null;
    product_id: string;
    customizations: any;
    additionalRequests: string;
    logo: string;
    designImage: string;
}

const ProductDetails = ({ product }: IProps) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [openReviewForm, setReviewForm] = useState(false);
    const [addToCartSuccess, setAddToCart] = useState(null);
    const [errors, setErrors] = useState({});
    const { data: products } = useSWR<IProduct[]>("/products");
    const [relatedProducts, setRelatedProducts] = useState([]);
    const { data: reviews } = useSWR<IReview[]>(
        product ? `/reviews?productId=${product?.product_id}` : null
    );
    const [quikView, setQuikView] = useState(null);
    const [isDesigner, setDesigner] = useState(false);
    const [state, setState] = useState<IState>({
        quantity: null,
        product_id: "",
        customizations: [],
        additionalRequests: "",
        designImage: "",
        logo: "",
    });

    useEffect(() => {
        if (product) {
            const customizatinosCopy = [...product.customizations];
            let customizations = [];

            customizatinosCopy.forEach((customization) => {
                if (customization.option) {
                    if (customization.type === "card") {
                        customizations.push({
                            customization_id: customization.customization_id,
                            type: "card",
                            name: customization.option.option_name,
                            card: "",
                        });
                    } else if (customization.type === "dropdown") {
                        customizations.push({
                            customization_id: customization.customization_id,
                            type: "dropdown",
                            name: customization.option.option_name,
                            dropdown: "",
                        });
                    }
                }
            });

            setState({
                ...state,
                quantity: { ...product.quantities[0] },
                product_id: product.product_id,
                customizations,
            });
        }
    }, [product]);

    useEffect(() => {
        if (product && products) {
            setRelatedProducts(
                products.filter((pro) =>
                    pro.category
                        ? pro.category?.category_name ===
                              product.category?.category_name &&
                          pro.product_name !== product.product_name
                        : false
                )
            );
        }
    }, [products, product]);

    const toggleReviewForm = () => {
        if (openReviewForm) {
            document.body.style.overflow = "auto";
            setReviewForm(false);
        } else {
            document.body.style.overflow = "hidden";
            setReviewForm(true);
        }
    };

    const toggleDesigner = () => {
        if (isDesigner) {
            document.body.style.overflow = "auto";
            setDesigner(false);
        } else {
            document.body.style.overflow = "hidden";
            setDesigner(true);
        }
    };

    const handleQtyChange = (e) => {
        const quantity = product.quantities.find(
            (q) => q.quantity_id === e.target.value
        );
        if (quantity) setState({ ...state, quantity });
    };

    const productCustomizationsAds = () => {
        let jsx = [];
        let adsCounter = 0;
        let totlaPrice = Number(state.quantity?.price);
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

        state.customizations.forEach((customization) => {
            if (customization.type === "card") {
                if (customization.card) {
                    const name = customization.name;
                    const price = customization.card.prices.find(
                        (p) => p.quantity_id === state.quantity.quantity_id
                    )?.price;
                    totlaPrice += Number(price) || 0;
                    adsCounter++;
                    return div(name, price, customization.customization_id);
                }
            } else if (customization.type === "dropdown") {
                if (customization.dropdown) {
                    const name = customization.name;
                    const price = customization.dropdown.prices.find((p) => {
                        return p.quantity_id === state.quantity.quantity_id;
                    })?.price;
                    totlaPrice += Number(price) || 0;
                    adsCounter++;
                    return div(name, price, customization.customization_id);
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

    const toggleAddToCartSuccess = (msg) => {
        if (addToCartSuccess) {
            document.body.style.overflow = "auto";
            setAddToCart(false);
        } else {
            document.body.style.overflow = "hidden";
            setAddToCart(msg);
        }
    };

    const toggleQuikView = (product) => {
        if (quikView) {
            document.body.style.overflow = "auto";
            setQuikView(null);
        } else {
            document.body.style.overflow = "hidden";
            setQuikView(product);
        }
    };

    const handleSaveDesign = (base64: any, logo: any) => {
        setState({ ...state, designImage: base64, logo });
        toggleDesigner();
    };

    // -------------------------- add product cart
    const handleAddToCart = () => {
        let tmpCustomizations = [];
        let tmpErrors: any = {};

        if (product.is_designer && !state.designImage)
            tmpErrors.designImage = "design image is required.";

        state.customizations.forEach((c) => {
            if (c.type === "dropdown") {
                if (c.dropdown) {
                    tmpErrors[c.name] = "";
                    return tmpCustomizations.push({
                        customization_id: c.customization_id,
                        type: "dropdown",
                        dropdown: c.dropdown.dropdown_id,
                    });
                } else tmpErrors[c.name] = `${c.name} is required.`;
            }
            if (c.type === "card") {
                if (c.card) {
                    tmpErrors[c.name] = "";
                    return tmpCustomizations.push({
                        customization_id: c.customization_id,
                        type: "card",
                        card: c.card.card_id,
                    });
                } else tmpErrors[c.name] = `${c.name} is required.`;
            }
        });

        for (let v of Object.values(tmpErrors)) {
            if (v) return setErrors({ ...errors, ...tmpErrors });
        }

        dispatch(
            addProductCart(
                {
                    product_id: state.product_id,
                    logo: state.logo,
                    designImage: state.designImage,
                    additionalRequests: "",
                    quantity: state.quantity.quantity_id,
                    customizations: tmpCustomizations,
                },
                toggleAddToCartSuccess,
                product.product_name
            )
        );
    };

    if (product)
        return (
            <>
                <HeadLayout
                    title={product.product_name}
                    image={apiImage(product.image.image_name)}
                    description={product.product_description.replace(
                        /<[^>]*>?/gm,
                        ""
                    )}
                />
                <div className="product-details-page">
                    <div className="product-details-main-section">
                        <ShowCaseSlider
                            isNewlyReleased={
                                Math.floor(
                                    (new Date().getTime() -
                                        new Date(
                                            product.created_at
                                        ).getTime()) /
                                        (1000 * 60 * 60 * 24)
                                ) < 30
                            }
                            discount={!!product.discount}
                            images={[product.image, ...product.showcase]}
                        />
                        <div className="product-details-content-container">
                            <div className="product-details-content-item">
                                <p className="product-details-name">
                                    {product.product_name}
                                </p>
                            </div>
                            <div className="product-details-content-item product-detail-price-container">
                                {!product.discount ? (
                                    <p className="product-details-price">
                                        <span className="product-details-starting-at">
                                            starting at
                                        </span>{" "}
                                        <span className="product-quik-view-price-text">
                                            {product.quantities[0].price} AED
                                        </span>
                                    </p>
                                ) : (
                                    <p className="product-details-price">
                                        <span className="product-details-starting-at">
                                            starting at
                                        </span>
                                        <span className="product-details-pre-dis-price">
                                            {product.quantities[0].price} AED
                                        </span>{" "}
                                        <span className="product-details-dis-price">
                                            {
                                                product.discount.quantities[0]
                                                    .price
                                            }{" "}
                                            AED
                                        </span>
                                    </p>
                                )}
                            </div>
                            <div className="product-details-content-item">
                                {!reviews ? (
                                    <Box>
                                        <CircularProgress
                                            style={{
                                                width: "20px",
                                                height: "20px",
                                            }}
                                            color="secondary"
                                        />
                                    </Box>
                                ) : (
                                    <Rating
                                        rating={product.rating}
                                        reviews={reviews}
                                    />
                                )}
                            </div>
                            <div className="product-details-content-item">
                                {product.sub_category ? (
                                    <Link
                                        href={`/shop?category=${product.category?.category_name}&sub_category=${product.sub_category.sub_category_name}`}
                                    >
                                        <a className="product-details-category-link">{`${product.category?.category_name} - ${product.sub_category?.sub_category_name}`}</a>
                                    </Link>
                                ) : product.category ? (
                                    <Link
                                        href={`/shop?category=${product.category.category_name}`}
                                    >
                                        <a className="product-details-category-link">{`${product.category.category_name}`}</a>
                                    </Link>
                                ) : null}
                            </div>
                            <div className="product-details-content-item">
                                {product.is_eligible ? (
                                    <p className="product-details-24-text">
                                        this product is eligible for 24 hour
                                        service.
                                    </p>
                                ) : null}
                            </div>
                            <div className="product-details-content-item sm-container">
                                <p className="sm-text">share to</p>
                                <div className="share-to-social-media-btn-container">
                                    <div className="share-to-social-media-btn">
                                        <FacebookShareButton
                                            url={`${domain}/product/${product.product_name}`}
                                        >
                                            <FacebookIcon
                                                size={30}
                                                borderRadius={10}
                                            />
                                        </FacebookShareButton>
                                    </div>
                                    <div className="share-to-social-media-btn">
                                        <WhatsappShareButton
                                            url={`${domain}/product/${product.product_name}`}
                                        >
                                            <WhatsappIcon
                                                size={30}
                                                borderRadius={10}
                                            />
                                        </WhatsappShareButton>
                                    </div>
                                    <div className="share-to-social-media-btn">
                                        <EmailShareButton
                                            url={`${domain}/product/${product.product_name}`}
                                        >
                                            <EmailIcon
                                                size={30}
                                                borderRadius={10}
                                            />
                                        </EmailShareButton>
                                    </div>
                                </div>
                            </div>
                            <div className="product-details-content-item">
                                <p className="product-details-headings">
                                    about this item
                                </p>
                                <div className="product-details-text-editor textEditor">
                                    {parser(product.about)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="product-details-customization-section">
                        <CustomizationForm
                            isDesigner={product.is_designer}
                            product={product}
                            toggleDesigner={toggleDesigner}
                            errors={errors}
                            state={state}
                            setState={setState}
                        />
                        <div className="product-details-qty-panel">
                            <div className="product-details-qty-container">
                                <div className="qty-select-container">
                                    <p className="product-details-qty-text">
                                        Quantity
                                    </p>
                                    <select
                                        className="form-input product-details-qty-input"
                                        name="qty"
                                        value={state.quantity?.quantity_id}
                                        onChange={handleQtyChange}
                                    >
                                        {product.quantities.map((quantity) => (
                                            <option
                                                key={quantity.quantity_id}
                                                value={quantity.quantity_id}
                                            >
                                                {quantity.qty}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="product-details-qty-item">
                                <p className="product-details-qty-price-text">
                                    {state.quantity?.price} AED
                                </p>
                            </div>
                            {productCustomizationsAds()}
                            <div className="product-details-qty-item">
                                <button
                                    type="button"
                                    className="button"
                                    onClick={handleAddToCart}
                                >
                                    add to cart
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="product-details-description-section">
                        <p className="product-details-description-head">
                            product description
                        </p>
                        <div className="product-details-description-content textEditor">
                            {parser(product.product_description)}
                        </div>
                    </div>
                    {!reviews ? (
                        <Box
                            display="flex"
                            justifyContent="center"
                            width="100%"
                        >
                            <CircularProgress color="secondary" />
                        </Box>
                    ) : (
                        <div className="product-details-reviews-section">
                            <div className="product-details-reviews-rating-bar-container">
                                <CustomerReviews
                                    reviews={reviews}
                                    rating={product.rating}
                                />
                                <div className="product-details-review-btn-container">
                                    <button
                                        type="button"
                                        className="button product-details-review-btn"
                                        onClick={toggleReviewForm}
                                    >
                                        review this product
                                    </button>
                                </div>
                            </div>
                            <ReviewList reviews={reviews} />
                        </div>
                    )}
                    <div className="product-details-related-products-section">
                        <div className="product-details-related-products-head-container">
                            <p className="product-details-related-products-head">
                                related products
                            </p>
                        </div>
                        {!relatedProducts.length ? (
                            <div className="product-details-no-related-products-container">
                                <p className="product-details-no-related-products-msg">
                                    no related products.
                                </p>
                            </div>
                        ) : (
                            <ProductSlider
                                toggleProductModal={toggleQuikView}
                                products={relatedProducts}
                                slidesPerView={5}
                            />
                        )}
                    </div>
                </div>
                {openReviewForm ? (
                    <ReviewForm product={product} close={toggleReviewForm} />
                ) : null}
                {quikView && (
                    <QuikView product={quikView} close={toggleQuikView} />
                )}
                {product.is_designer && (
                    <div
                        style={
                            isDesigner
                                ? { display: "block" }
                                : { display: "none" }
                        }
                    >
                        <Designer
                            images={product.designer}
                            close={toggleDesigner}
                            handleSaveDesign={handleSaveDesign}
                        />
                    </div>
                )}
                {addToCartSuccess && (
                    <ActionModal
                        close={toggleAddToCartSuccess}
                        title="Go to cart"
                        msg={addToCartSuccess}
                        handler={() => {
                            router.push("/cart");
                        }}
                        loading={false}
                        btnTxt="cart"
                        btnIcon={<CheckIcon />}
                        type="confirmation"
                    />
                )}
            </>
        );
    return <ErrorPage statusCode={404} />;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const product = await apiCall<IProduct[]>(
        "get",
        `/product/${ctx.params.productName}`
    );

    return {
        props: {
            product,
        },
    };
};

export default ProductDetails;

import dateFormat from "dateformat";
import { apiImage } from "../../../utils/apiCall";
import ImageOpt from "../../imageOpt";

// components
import CommentForm from "../comment/commentForm";

const OrderDetails = ({ order }) => {
    const productsJsx = () => {
        if (order.products.length > 0) {
            return order.products.map((product) => (
                <div className="payment-product-item" key={product._id}>
                    <div className="payment-product-img-container">
                        <ImageOpt
                            width={100}
                            height={100}
                            className="payment-product-img"
                            src={product?.image}
                            alt=""
                        />
                    </div>
                    <div className="payment-product-name-container">
                        <p className="payment-product-name">{product.name}</p>
                        <p className="payment-product-info-text">
                            price: {product.quantity.price} AED
                        </p>
                        <p className="payment-product-info-text">
                            qty: {product.quantity.qty} qty
                        </p>
                        <p className="payment-product-info-text">
                            Discount:{" "}
                            {product.discount ? product.discount.price : "0"}
                            {"0 "}
                            AED
                        </p>
                    </div>
                    <div className="payment-product-ldi-container">
                        {product.logo && (
                            <div className="payment-product-ldi-item">
                                <p className="payment-product-ldi-text">logo</p>
                                <div className="payment-product-ldi-img-contianer">
                                    <a
                                        href={apiImage(product.designImage)}
                                        target="_blank"
                                    >
                                        <ImageOpt
                                            width={100}
                                            height={100}
                                            className="payment-product-ldi-img"
                                            src={product?.logo}
                                            alt=""
                                        />
                                    </a>
                                </div>
                            </div>
                        )}
                        {product.designImage && (
                            <div className="payment-product-ldi-item">
                                <p className="payment-product-ldi-text">
                                    design
                                </p>
                                <div className="payment-product-ldi-img-contianer">
                                    <a
                                        href={apiImage(product.designImage)}
                                        target="_blank"
                                    >
                                        <ImageOpt
                                            width={100}
                                            height={100}
                                            className="payment-product-ldi-img"
                                            src={product.designImage}
                                            alt=""
                                        />
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ));
        }
    };

    const dots = () => {
        return (
            <div className="payment-dots-container">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
            </div>
        );
    };

    return (
        // <Modal type="parent" closeInfo={{ close, check: false }}>
        <div className="payment-container">
            <div className="payment-content-container">
                <div className="payment-overview-container">
                    <h3 className="payment-headings payment-overview-head">
                        payment details
                    </h3>
                    <div className="payment-heading-container">
                        <p className="payment-overview-price">
                            {parseFloat(
                                String(order.charge.amount / 100)
                            ).toFixed(2)}
                            د.ا AED {order?.charge?.status}
                        </p>
                        <p className="payment-overview-order-refrence">
                            <span className="order-refrence-title">
                                order refrence:
                            </span>{" "}
                            {order.order_id}
                        </p>
                    </div>
                    <div className="payment-overview-main-content-container">
                        <div className="payment-overview-date-container">
                            <p className="payment-label">date</p>
                            <p>
                                {dateFormat(
                                    order.created_at,
                                    "dddd, mmmm dS, yyyy, h:MM:ss TT"
                                )}
                            </p>
                        </div>
                        <div className="payment-overview-customer-container">
                            <p className="payment-label">customer</p>
                            <p>{order.charge.receipt_email}</p>
                        </div>
                        <div className="payment-overview-method-container">
                            <p className="payment-label">payment method</p>
                            <div className="payment-card-number">
                                {!order.is_paid ? (
                                    <p>Cash on delivery</p>
                                ) : (
                                    <>
                                        {dots()}
                                        <p>
                                            {
                                                order.charge
                                                    .payment_method_details.card
                                                    .last4
                                            }
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="payment-method-container">
                    <h3 className="payment-headings">payment method</h3>
                    {!order.is_paid ? (
                        <p>Cash on delivery</p>
                    ) : (
                        <>
                            <div className="payment-method-content-container">
                                <p className="payment-info-text">ID</p>
                                <p>{order.charge.payment_method}</p>
                            </div>
                            <div className="payment-method-content-container">
                                <p className="payment-info-text">number</p>
                                <div className="payment-card-number">
                                    {dots()}
                                    <p>
                                        {
                                            order.charge.payment_method_details
                                                .card.last4
                                        }
                                    </p>
                                </div>
                            </div>
                            <div className="payment-method-content-container">
                                <p className="payment-info-text">
                                    finger print
                                </p>
                                <p>
                                    {
                                        order.charge.payment_method_details.card
                                            .fingerprint
                                    }
                                </p>
                            </div>
                            <div className="payment-method-content-container">
                                <p className="payment-info-text">expires</p>
                                <p>
                                    {
                                        order.charge.payment_method_details.card
                                            .exp_month
                                    }{" "}
                                    /{" "}
                                    {
                                        order.charge.payment_method_details.card
                                            .exp_year
                                    }
                                </p>
                            </div>
                        </>
                    )}
                </div>
                <div className="payment-products-container">
                    <div className="payment-products-container">
                        <h3 className="payment-headings">Products</h3>
                        <div className="payment-products-list">
                            {productsJsx()}
                        </div>
                    </div>
                </div>
                <div className="payment-shipping-container">
                    <h3 className="payment-headings">shipping information</h3>
                    <div>
                        <div className="payment-shipping-content-container">
                            <p className="payment-info-text">recipient</p>
                            <p>{order.charge.shipping.name}</p>
                        </div>
                        <div className="payment-shipping-content-container">
                            <p className="payment-info-text">recipient email</p>
                            <p>{order.charge.receipt_email}</p>
                        </div>
                        <div className="payment-shipping-content-container">
                            <p className="payment-info-text">phone</p>
                            <p>{order.charge.shipping.phone}</p>
                        </div>
                        <div className="payment-shipping-content-container payment-address-container">
                            <p className="payment-info-text">address</p>
                            <div>
                                <div className="payment-shipping-content-container">
                                    <p className="payment-info-text">city</p>
                                    <p>{order.charge.shipping.address.city}</p>
                                </div>
                                <div className="payment-shipping-content-container">
                                    <p className="payment-info-text">line1</p>
                                    <p>{order.charge.shipping.address.line1}</p>
                                </div>
                                <div className="payment-shipping-content-container">
                                    <p className="payment-info-text">line2 </p>
                                    <p>{order.charge.shipping.address.line2}</p>
                                </div>
                                <div className="payment-shipping-content-container">
                                    <p className="payment-info-text">
                                        postal code
                                    </p>
                                    <p>
                                        {
                                            order.charge.shipping.address
                                                .postal_code
                                        }
                                    </p>
                                </div>
                                <div className="payment-shipping-content-container">
                                    <p className="payment-info-text">state</p>
                                    <p>{order.charge.shipping.address.state}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="payment-headings">comments</h3>
                    <CommentForm orderId={order.order_id} />
                    {order.comments.length ? (
                        <div className="payment-comments-list">
                            {order.comments
                                .sort(
                                    (a, b) =>
                                        new Date(b.created_at).valueOf() -
                                        new Date(a.created_at).valueOf()
                                )
                                .map((comment) => {
                                    if (comment.user)
                                        return (
                                            <div
                                                key={comment.comment_id}
                                                className="payment-comment-item-container"
                                            >
                                                <div className="payment-comment-user-info-container">
                                                    {comment.user.avatar && (
                                                        <div className="payment-comment-profile-img">
                                                            <ImageOpt
                                                                width={50}
                                                                height={50}
                                                                className="payment-comment-profile-img"
                                                                src={
                                                                    comment.user
                                                                        ?.avatar
                                                                        ?.image_name
                                                                }
                                                                alt=""
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="payment-comment-username-container">
                                                        <p className="payment-comment-username">
                                                            {
                                                                comment.user
                                                                    .username
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div>
                                                        <p className="payment-comment-date">
                                                            {dateFormat(
                                                                comment.created_at,
                                                                "dddd, mmmm dS, yyyy, h:MM:ss TT"
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div className="payment-comment-text-container">
                                                        <p>{comment.text}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                })}
                        </div>
                    ) : (
                        <div>
                            <p>no comments.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
        // </Modal>
    );
};

export default OrderDetails;

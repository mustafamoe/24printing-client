import StarIcon from "@material-ui/icons/Star";
import { IProduct } from "../../types/product";

interface IProps {
    product: IProduct;
}

const CustomerReviews = ({ product }: IProps) => {
    const reviewsBarItemJsx = () => {
        let jsx = [];

        for (let i = 1; i <= 5; i++) {
            let count = 0;
            let reviews = product.reviews.length;

            product.reviews.forEach((review) => {
                if (Math.round(review.review_rating) === i) {
                    count = count + 1;
                }
            });

            let percent = !reviews ? 0 : (count / Number(reviews)) * 100;

            jsx.unshift(
                <div key={i} className="product-details-review-bar-item">
                    <p className="product-details-review-bar-item-stars">
                        {i} star
                    </p>
                    <div className="product-details-review-item-bar-wrapper">
                        <div
                            className="product-details-review-bar-item-bar"
                            style={{ width: `${percent}%` }}
                        ></div>
                    </div>
                    <p className="product-details-review-bar-item-percentage">
                        {parseFloat(String(percent)).toFixed(0)}%
                    </p>
                </div>
            );
        }

        return jsx;
    };

    return (
        <div className="product-details-reviews-rating-bars-wrapper">
            <div>
                <p className="product-details-reviews-head">
                    {product.reviews.length
                        ? "Customer Reviews"
                        : "No customer reviews"}
                </p>
                <div className="product-customer-reviews-rating-wrapper">
                    <div className="product-customer-reviews-rating-container">
                        <div className="rating-stars">
                            {[...Array(5)].map((star, index) => {
                                let ratingValue = index + 1;
                                return (
                                    <StarIcon
                                        key={index}
                                        style={{
                                            color:
                                                ratingValue <=
                                                Math.round(product.rating)
                                                    ? "gold"
                                                    : "gray",
                                        }}
                                    />
                                );
                            })}
                        </div>
                        <p className="product-details-customer-rating-out-5">
                            {parseFloat(String(product.rating)).toFixed(1)} out
                            of 5
                        </p>
                    </div>
                    <div className="product-customer-ratings-details-container">
                        <p className="product-details-customer-ratings">
                            {product.reviews.length} customer ratings
                        </p>
                    </div>
                </div>
            </div>
            {reviewsBarItemJsx()}
        </div>
    );
};

export default CustomerReviews;

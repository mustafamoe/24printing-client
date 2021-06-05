import dateFormat from "dateformat";
import ImageOpt from "../imageOpt";

// components
import Rating from "../product/rating";
import { IReview } from "../../types/reviews";

interface IProps {
    review: IReview;
}

const ProductReviewItem = ({ review }: IProps) => {
    return (
        <div className="product-review-item-container">
            <div className="product-review-user-info-container">
                <div className="product-review-profile-img">
                    <ImageOpt
                        className="product-review-profile-img"
                        src={review.created_by?.avatar?.image_name}
                        alt=""
                        width={50}
                        height={50}
                    />
                </div>
                <div className="product-review-username-container">
                    <p className="product-review-username">
                        {review.created_by?.username}
                    </p>
                </div>
            </div>
            <div className="product-review-rating-container">
                <Rating rating={review.review_rating} noReviewCounter={true} />
            </div>
            <div>
                <div>
                    <p className="product-review-date">
                        {dateFormat(review.created_at, "dddd, mmmm dS, yyyy")}
                    </p>
                </div>
                <div className="product-review-text-container">
                    <h3>{review.review_title}</h3>
                </div>
                <div className="product-review-text-container">
                    <p>{review.review_description}</p>
                </div>
            </div>
        </div>
    );
};

export default ProductReviewItem;

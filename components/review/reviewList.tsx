// components
import { IReview } from "../../types/reviews";
import ReviewItem from "./reviewItem";

interface IProps {
    reviews: IReview[];
}

const ReviewList = ({ reviews }: IProps) => {
    return (
        <div className="product-review-list-container">
            {reviews
                .sort(
                    (a, b) =>
                        new Date(b.created_at).valueOf() -
                        new Date(a.created_at).valueOf()
                )
                .map((review) => (
                    <ReviewItem key={review.review_id} review={review} />
                ))}
        </div>
    );
};

export default ReviewList;

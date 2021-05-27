import React from "react";
import StarIcon from "@material-ui/icons/Star";

interface IProps {
    rating: number;
    reviews?: any;
    noReviewCounter?: any;
}

const Rating = ({ rating, reviews, noReviewCounter }: IProps) => {
    return (
        <div className="product-rating-wrapper">
            <div className="product-rating-container">
                <div className="rating-stars">
                    {[...Array(5)].map((star, index) => {
                        let ratingValue = index + 1;
                        return (
                            <StarIcon
                                key={index}
                                style={{
                                    color:
                                        ratingValue <= Math.round(rating)
                                            ? "gold"
                                            : "gray",
                                }}
                            />
                        );
                    })}
                </div>
                {noReviewCounter ? null : <p>{reviews.length}</p>}
            </div>
        </div>
    );
};

export default Rating;

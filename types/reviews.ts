import { IUser } from "./user";

export interface IReview {
    review_id: string;
    review_rating: number;
    review_title: string;
    review_description: string;
    user: IUser;
    created_at: Date;
}

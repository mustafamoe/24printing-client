import { IUser } from "./user";

export interface IReview {
    review_id: string;
    review_rating: number;
    review_title: string;
    review_description: string;
    created_by: IUser;
    created_at: Date;
}

import { IUser } from "./user";

export interface IComment {
    comment_id: string;
    text: string;
    is_private: boolean;
    user: IUser;
    created_at: Date;
}

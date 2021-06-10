import { IUser } from "./user";

export interface IUserDiscount {
    user_discount_id: string;
    percentage: number;
    duration: Date;
    created_by: IUser;
    created_at: Date;
    updated_at: Date;
    updated_by: IUser;
}

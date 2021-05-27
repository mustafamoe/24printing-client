import { IComment } from "./comment";
import { IProduct } from "./product";
import { IUser } from "./user";

export type IOrderStatus =
    | "reviewing"
    | "approved"
    | "under process"
    | "ready to ship"
    | "completed";

export interface IOrder {
    order_id: string;
    status: IOrderStatus;
    token: any;
    charge: any;
    products: IProduct[];
    expected_date: Date;
    comments: IComment[];
    created_by: IUser;
    updated_by: IUser;
    created_at: Date;
    updated_at: Date;
}

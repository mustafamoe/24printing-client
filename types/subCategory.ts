import { IUser } from "./user";
import { ICategory } from "./category";

export interface ISubCategory {
    sub_category_id: string;
    sub_category_name: string;
    category: ICategory;
    sub_category_order: string;
    is_hidden: boolean;
    created_at: Date;
    created_by: IUser;
    updated_at: Date;
    updated_by: IUser;
}

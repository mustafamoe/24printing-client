import { ISubCategory } from "./subCategory";
import { IUser } from "./user";

export interface ICategory {
    category_id: string;
    category_name: string;
    category_order: string;
    sub_categories: ISubCategory[];
    is_hidden: boolean;
    created_at: Date;
    created_by: IUser;
    updated_at: Date;
    updated_by: IUser;
}

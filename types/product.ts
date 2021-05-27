import { IUser } from "./user";
import { IImage } from "./image";
import { ICategory } from "./category";
import { ISubCategory } from "./subCategory";
import { IQuantity } from "./quantity";
import { ICustomization } from "./customization";
import { IReview } from "./reviews";
import { IDiscount } from "./discount";
import { IDesigner } from "./designer";

export interface IProduct {
    product_id: string;
    product_name: string;
    product_description: string;
    about: string;
    image: IImage;
    showcase: IImage[];
    quantities: IQuantity[];
    category: ICategory;
    sub_category: ISubCategory;
    reviews: IReview[];
    customizations: ICustomization[];
    designer: IDesigner[];
    discount: IDiscount | null;
    rating: number;
    is_eligible: boolean;
    is_designer: boolean;
    is_featured: boolean;
    is_published: boolean;
    created_by: IUser;
    created_at: Date;
    updated_by: IUser;
    updated_at: Date;
}

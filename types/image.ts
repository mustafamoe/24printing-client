import { ICategory } from "./category";
import { IUser } from "./user";

export type ImageFormat = "png" | "jpeg";

export interface IImage {
    image_id: string;
    image_name: string;
    title: string;
    category: ICategory;
    created_by: IUser;
    created_at: Date;
}

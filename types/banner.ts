import { IImage } from "./image";
import { IUser } from "./user";

export interface IBanner {
    banner_id: string;
    image: IImage;
    title: string;
    content: string;
    link: string;
    banner_page: "home" | "shop";
    created_at: Date;
    created_by: IUser;
    updated_at: Date;
    updated_by: IUser;
}

export const bannerPages = ["home", "shop"];

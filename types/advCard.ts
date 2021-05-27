import { IImage } from "./image";
import { IUser } from "./user";

export interface IAdvCard {
    adv_card_id: string;
    image: IImage;
    title: string;
    content: string;
    link: string;
    created_at: Date;
    created_by: IUser;
    updated_at: Date;
    updated_by: IUser;
}

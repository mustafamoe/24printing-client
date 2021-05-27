import { IImage } from "./image";
import { IUser } from "./user";

export interface IAdvPopup {
    adv_popup_id: string;
    image: IImage;
    link: string;
    is_active: boolean;
    created_at: Date;
    created_by: IUser;
    updated_at: Date;
    updated_by: IUser;
}

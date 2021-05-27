import { IUser } from "./user";

export type ImageFormat = "png" | "jpeg";

export interface IImage {
    image_id: string;
    image_name: string;
    created_by: IUser;
    created_at: Date;
}

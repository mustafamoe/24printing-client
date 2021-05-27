import { IImage } from "./image";

export interface IUser {
    user_id: string;
    avatar: IImage;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password: string;
    version: number;
    is_active: boolean;
    is_blocked: boolean;
    is_admin: boolean;
    is_super_admin: boolean;
    is_accountant: boolean;
    is_customer_service: boolean;
}

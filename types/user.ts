import { IImage } from "./image";

export type Access =
    | "is_accountant"
    | "is_admin"
    | "is_super_admin"
    | "is_customer_service";

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

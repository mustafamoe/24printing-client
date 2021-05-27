import { IUser } from "./user";

export interface IAddress {
    address_id: string;
    line_1: string;
    line_2: string;
    city: string;
    zip_code: number;
    created_at: Date;
    created_by: IUser;
    updated_at: Date;
    updated_by: IUser;
}

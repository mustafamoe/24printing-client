import { IUser } from "./user";

export interface IOption {
    option_id: string;
    option_name: string;
    created_at: Date;
    created_by: IUser;
    updated_at: Date;
    updated_by: IUser;
}

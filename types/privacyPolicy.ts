import { IUser } from "./user";

export interface IPrivacyPolicy {
    content: string;
    updated_at: Date;
    updated_by: IUser;
}

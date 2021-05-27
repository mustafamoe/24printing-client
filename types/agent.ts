import { IUser } from "./user";
import { Customer } from "./customer";

export type Agent = {
    socketId: string;
    user: IUser;
    entered_at: Date;
    customer: Customer | null;
};

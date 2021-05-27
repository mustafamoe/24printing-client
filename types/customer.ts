import { IUser } from "./user";
import { Agent } from "./agent";

export interface Guest {
    user_id: string;
    email: string;
    name: string;
    phone: string;
}

export type Customer = {
    socketId: string;
    user: IUser | Guest;
    entered_at: Date;
    type: "guest" | "auth";
    agent: Agent | null;
};

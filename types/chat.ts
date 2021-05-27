import { IUser } from "./user";

type Agent = {
    socketId: string;
    user: IUser;
    entered_at: Date;
    customer: IUser | null;
};

type Customer = {
    socketId: string;
    user: IUser;
    entered_at: Date;
    agent: IUser | null;
};

export interface IChat {
    customers: Customer[];
    agents: Agent[];
}

type MessageType = "info" | "greet" | "conver" | "warning" | "error";

export interface IMessage {
    message_id: string;
    user?: IUser;
    type: MessageType;
    txt: string;
    sent_at: Date;
}

export interface IRoom {
    room_id: string;
    count: number;
    users: IUser[];
    started_at: Date;
}

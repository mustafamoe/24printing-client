import { io } from "socket.io-client";
import { domain } from "./apiCall";

export const getSocket = () => io(domain, { autoConnect: false });

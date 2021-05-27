import { io } from "socket.io-client";
import { apiUrl } from "./apiCall";

export const getSocket = () => io(apiUrl, { autoConnect: false });

import { io } from "socket.io-client";
import { apiUrl, isProduction } from "./apiCall";

export const getSocket = () =>
    io(`${apiUrl}${isProduction ? "/api" : ""}`, { autoConnect: false });

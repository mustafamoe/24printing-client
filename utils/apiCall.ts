import axios, { Method } from "axios";

const isDev: boolean = true;

type ApiUrl = "https://api.24printing.com" | "http://localhost:5000";
type ClientUrl = "https://24printing.com" | "http://localhost:3000";

export const apiUrl: ApiUrl = isDev
    ? "http://localhost:5000"
    : "https://api.24printing.com";

export const clientUrl: ClientUrl = isDev
    ? "http://localhost:3000"
    : "https://24printing.com";

export const apiImage = (
    image: string,
    width?: number,
    q?: number | undefined
): string => {
    return `https://res.cloudinary.com/dkdqozb5n/image/upload/q_${
        q ? q : "auto"
    }${width ? `,w_${width}` : ""},f_auto,fl_lossy/v1620040545/${image}`;
};

export const apiCall = <T>(
    method: Method,
    url: string,
    data?: any
): Promise<T> => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await axios({
                method,
                url: `${apiUrl}${url}`,
                data,
                withCredentials: true,
            });
            return resolve(res.data);
        } catch (err) {
            if (err.response) {
                return reject(err.response.data.error.message);
            } else {
                return reject("something went wrong on the server!");
            }
        }
    });
};

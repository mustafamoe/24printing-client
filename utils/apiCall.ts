import axios, { Method } from "axios";

const isDev: boolean = true;
const domain = "imazadat.com";

export const apiUrl: string = isDev
    ? "http://localhost:5000/api"
    : `https://${domain}/api`;

export const clientUrl: string = isDev
    ? "http://localhost:3000"
    : `https://${domain}`;

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
                return reject("Something went wrong on the server!");
            }
        }
    });
};

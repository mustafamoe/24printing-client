import axios, { Method } from "axios";

export const isProduction: boolean = true;

export const domain = isProduction
    ? "https://24printing.ae"
    : `http://localhost:5000`;

export const apiImage = (
    image: string,
    width?: number,
    q?: number | undefined
): string => {
    return `https://d3eq7l4fuof9k0.cloudfront.net/${image}`;
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
                url: `${domain}/api${url}`,
                data,
                withCredentials: true,
            });
            return resolve(res.data);
        } catch (err) {
            if (err.response) {
                return reject(
                    err.response.data.error?.message ||
                        "Something went wrong on the server!"
                );
            } else {
                return reject("Something went wrong on the server!");
            }
        }
    });
};

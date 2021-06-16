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
    return `https://24printing.s3.amazonaws.com/${image}`;
    // return `https://res.cloudinary.com/dkdqozb5n/image/upload/q_${
    //     q ? q : "auto"
    // }${width ? `,w_${width}` : ""},f_auto,fl_lossy/v1620040545/${image}`;
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

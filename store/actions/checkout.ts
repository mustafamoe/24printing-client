import { CheckoutActionTypes } from "../types/checkout";

export const addProducts = (order: any): CheckoutActionTypes => {
    return {
        type: "ADD_PRODUCTS",
        order,
    };
};

export const clearProducts = (): CheckoutActionTypes => {
    return {
        type: "CLEAR_PRODUCTS",
    };
};

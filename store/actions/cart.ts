import { ICart } from "../../types/cart";
import { IQuantity } from "../../types/quantity";
import { CartActionTypes } from "../types/cart";

export const getCart = (): CartActionTypes => {
    return {
        type: "GET_CART",
    };
};

export const addProductCart = (
    product: ICart,
    toggleAddToCartSuccess: any,
    productName: string
): CartActionTypes => {
    return {
        type: "ADD_PRODUCT_CART",
        product,
        toggleAddToCartSuccess,
        productName,
    };
};

export const removeProductCart = (productId: string): CartActionTypes => {
    return {
        type: "REMOVE_PRODUCT_CART",
        productId,
    };
};

export const changeProductQtyCart = (
    productId: string,
    quantity: IQuantity
): CartActionTypes => {
    return {
        type: "CHANGE_PRODUCT_QTY_CART",
        productId,
        quantity,
    };
};

export const clearCart = (): CartActionTypes => {
    return {
        type: "CLEAR_CART",
    };
};

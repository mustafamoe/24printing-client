import { WishlistActionTypes } from "../types/wishlist";

export const getWishlist = (): WishlistActionTypes => {
    return {
        type: "GET_WISHLIST",
    };
};

export const addProductWishlist = (productId: string): WishlistActionTypes => {
    return {
        type: "ADD_PRODUCT_WISHLIST",
        productId,
    };
};

export const removeProductWishlist = (
    productId: string
): WishlistActionTypes => {
    return {
        type: "REMOVE_PRODUCT_WISHLIST",
        productId,
    };
};

export const clearWishlist = (): WishlistActionTypes => {
    return {
        type: "CLEAR_WISHLIST",
    };
};

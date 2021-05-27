import { IProduct } from "../../types/product";

import {
    GET_WISHLIST,
    ADD_PRODUCT_WISHLIST,
    REMOVE_PRODUCT_WISHLIST,
    CLEAR_WISHLIST,
} from "../actionTypes";

// signin
interface GetWishlist {
    type: typeof GET_WISHLIST;
}

interface AddProductWishlist {
    type: typeof ADD_PRODUCT_WISHLIST;
    productId: string;
}

interface RemoveProductWishlist {
    type: typeof REMOVE_PRODUCT_WISHLIST;
    productId: string;
}

interface ClearWishlist {
    type: typeof CLEAR_WISHLIST;
}

export type WishlistActionTypes =
    | GetWishlist
    | AddProductWishlist
    | RemoveProductWishlist
    | ClearWishlist;

export type WishlistState = IProduct[];

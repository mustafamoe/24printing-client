import {
    GET_WISHLIST,
    ADD_PRODUCT_WISHLIST,
    REMOVE_PRODUCT_WISHLIST,
    CLEAR_WISHLIST,
} from "../actionTypes";
import { WishlistState, WishlistActionTypes } from "../types/wishlist";

const INITIAL_STATE: WishlistState = [];

const wishlistReducer = (
    state = INITIAL_STATE,
    action: WishlistActionTypes
) => {
    switch (action.type) {
        case GET_WISHLIST:
            var wishlist: string[] = JSON.parse(
                localStorage.getItem("wishlist")
            );

            if (wishlist) {
                return wishlist;
            }

            localStorage.setItem("wishlist", JSON.stringify([]));

            return [];
        case ADD_PRODUCT_WISHLIST:
            var wishlist: string[] = JSON.parse(
                localStorage.getItem("wishlist")
            );

            if (wishlist) {
                var foundProduct: string = wishlist.find(
                    (p: string) => p === action.productId
                );
                if (foundProduct) return state;
                wishlist.push(action.productId);
                localStorage.setItem("wishlist", JSON.stringify(wishlist));

                return wishlist;
            }

            localStorage.setItem("wishlist", JSON.stringify([]));

            return [];
        case REMOVE_PRODUCT_WISHLIST:
            var wishlist: string[] = JSON.parse(
                localStorage.getItem("wishlist")
            );

            if (wishlist) {
                wishlist = wishlist;
                wishlist = wishlist.filter((p) => p !== action.productId);
                localStorage.setItem("wishlist", JSON.stringify(wishlist));

                return wishlist;
            }

            return state;
        case CLEAR_WISHLIST:
            localStorage.setItem("wishlist", JSON.stringify([]));

            return [];
        default:
            return state;
    }
};

export default wishlistReducer;

import {
    GET_CART,
    ADD_PRODUCT_CART,
    EDIT_CART_PRODUCT,
    REMOVE_PRODUCT_CART,
    CHANGE_PRODUCT_QTY_CART,
    CLEAR_CART,
} from "../actionTypes";
import { ICart } from "../../types/cart";
import { CartActionTypes, CartState } from "../types/cart";

const INITIAL_STATE: ICart[] = [];

const cartReducer = (state = INITIAL_STATE, action: CartActionTypes) => {
    switch (action.type) {
        case GET_CART:
            var cart: ICart[] = JSON.parse(localStorage.getItem("cart"));
            if (cart) {
                return cart;
            } else localStorage.setItem("cart", JSON.stringify([]));

            return [];
        case ADD_PRODUCT_CART:
            const toggleAddToCartSuccess = action.toggleAddToCartSuccess;
            var cart: ICart[] = JSON.parse(localStorage.getItem("cart"));
            if (cart) {
                const product = cart.find(
                    (product) =>
                        product.product_id === action.product.product_id
                );
                if (product) {
                    toggleAddToCartSuccess(
                        `you have already added ${action.productName} to your cart.`
                    );
                    return state;
                }
                toggleAddToCartSuccess(
                    `you have just added ${action.productName} to your cart!`
                );
                var newCart: ICart[] = [...cart, action.product];
                localStorage.setItem("cart", JSON.stringify(newCart));

                return newCart;
            }

            return state;
        case REMOVE_PRODUCT_CART:
            var cart: ICart[] = JSON.parse(localStorage.getItem("cart"));
            var newCart: ICart[] = [...cart].filter(
                (product) => product.product_id !== action.productId
            );
            localStorage.setItem("cart", JSON.stringify(newCart));

            return newCart;
        case CHANGE_PRODUCT_QTY_CART:
            var cart: ICart[] = JSON.parse(localStorage.getItem("cart"));
            var newCart = [...cart];
            var selectedProduct = newCart.find(
                (product) => product.product_id === action.productId
            );

            var index = newCart.indexOf(selectedProduct);
            newCart[index].quantity = action.quantity?.quantity_id;
            localStorage.setItem("cart", JSON.stringify(newCart));

            return newCart;
        case CLEAR_CART:
            localStorage.setItem("cart", JSON.stringify([]));
            return [];
        // case EDIT_CART_PRODUCT:
        //     var cart = localStorage.getItem("cart");
        //     if (cart) {
        //         cart = JSON.parse(cart);
        //         const product = cart.find(
        //             (product) => product.id === action.product.id
        //         );
        //         if (product) {
        //             var index = cart.indexOf(product);
        //             cart[index] = action.product;
        //             localStorage.setItem("cart", JSON.stringify(newCart));
        //         }

        //         return newCart;
        //     }

        //     return state;
        default:
            return state;
    }
};

export default cartReducer;

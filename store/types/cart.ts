import { ICart } from "../../types/cart";
import { IQuantity } from "../../types/quantity";

import {
    GET_CART,
    ADD_PRODUCT_CART,
    EDIT_CART_PRODUCT,
    REMOVE_PRODUCT_CART,
    CHANGE_PRODUCT_QTY_CART,
    CLEAR_CART,
} from "../actionTypes";

// signin
interface GetCart {
    type: typeof GET_CART;
}

interface AddProductCart {
    type: typeof ADD_PRODUCT_CART;
    product: ICart;
    toggleAddToCartSuccess: any;
    productName: string;
}

interface EditProductCart {
    type: typeof EDIT_CART_PRODUCT;
    productId: string;
}

interface RemoveProductCart {
    type: typeof REMOVE_PRODUCT_CART;
    productId: string;
}

interface ChangeProductQtyCart {
    type: typeof CHANGE_PRODUCT_QTY_CART;
    productId: string;
    quantity: IQuantity;
}

interface ClearCart {
    type: typeof CLEAR_CART;
}

export type CartActionTypes =
    | GetCart
    | AddProductCart
    | EditProductCart
    | RemoveProductCart
    | ChangeProductQtyCart
    | ClearCart;

export type CartState = ICart[];

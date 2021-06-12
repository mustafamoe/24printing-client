import { ADD_PRODUCTS, CLEAR_PRODUCTS } from "../actionTypes";

// signin
type AddProducts = {
    type: typeof ADD_PRODUCTS;
    order: any;
};

type ClearProducts = {
    type: typeof CLEAR_PRODUCTS;
};

export type CheckoutActionTypes = AddProducts | ClearProducts;

export type CheckoutState = any;

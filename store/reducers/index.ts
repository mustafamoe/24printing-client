import { combineReducers } from "redux";

// reducers
import auth from "./user";
import cart from "./cart";
import wishlist from "./wishlist";

const rootReducer = combineReducers({
    auth,
    wishlist,
    cart,
});

export type RootReducer = ReturnType<typeof rootReducer>;

export default rootReducer;

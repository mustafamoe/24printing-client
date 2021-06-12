import { combineReducers } from "redux";

// reducers
import auth from "./user";
import cart from "./cart";
import wishlist from "./wishlist";
import checkout from "./checkout";

const rootReducer = combineReducers({
    auth,
    wishlist,
    cart,
    checkout,
});

export type RootReducer = ReturnType<typeof rootReducer>;

export default rootReducer;

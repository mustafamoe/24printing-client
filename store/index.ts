import { createStore, applyMiddleware } from "redux";
import reduxThunk from "redux-thunk";
import rootReducer from "./reducers";
import { composeWithDevTools } from "redux-devtools-extension";

const storeConfig = () =>
    createStore(rootReducer, composeWithDevTools(applyMiddleware(reduxThunk)));

export default storeConfig;

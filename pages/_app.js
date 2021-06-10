import { SWRConfig } from "swr";
import { apiCall } from "../utils/apiCall";
import { Provider, useDispatch, useSelector } from "react-redux";
import cookie from "cookie";
import { useEffect } from "react";
import { authOnloadCall } from "../store/actions/user";
import storeConfig from "../store";
import { ThemeProvider } from "@material-ui/core";
import theme from "../utils/theme";
import NProgress from "nprogress";
import Router from "next/router";

// actions
import { getCart } from "../store/actions/cart";
import { getWishlist } from "../store/actions/wishlist";

// style sheets
import "../styles/globals.css";
import "swiper/swiper-bundle.css";
import "nprogress/nprogress.css";
import "../styles/signin.css";

// components
import Layout from "../components/layout";

NProgress.configure({ showSpinner: false });

Router.onRouteChangeStart = () => {
    NProgress.start();
};

Router.onRouteChangeComplete = () => {
    NProgress.done();
};

Router.onRouteChangeError = () => {
    NProgress.done();
};

// store
const store = storeConfig();

// data fetcher
const Fetcher = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const { isAuth } = cookie.parse(document.cookie);

        if (isAuth) {
            dispatch(authOnloadCall());
        }

        dispatch(getCart());
        dispatch(getWishlist());
    }, []);

    return null;
};

function MyApp({ Component, pageProps }) {
    return (
        <Provider store={store}>
            <Fetcher />
            <SWRConfig
                value={{
                    refreshInterval: 10000,
                    fetcher: async (url) => {
                        return await apiCall("get", url);
                    },
                }}
            >
                <ThemeProvider theme={theme}>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </ThemeProvider>
            </SWRConfig>
        </Provider>
    );
}

export default MyApp;

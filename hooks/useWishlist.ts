import { useSelector } from "react-redux";
import useSwr from "swr";
import { RootReducer } from "../store/reducers";
import { IProduct } from "../types/product";

const useWishlist = (): IProduct[] => {
    const { data: products } = useSwr<IProduct[]>("/products");
    const wishlist = useSelector((state: RootReducer) => state.wishlist);

    const getWishListProducts = () => {
        let arr = [];

        wishlist.forEach((p) => {
            const product = products.find((pro) => pro.product_id === p);
            if (product) arr.push(product);
        });

        return arr;
    };

    if (!products) return [];
    return getWishListProducts();
};

export default useWishlist;

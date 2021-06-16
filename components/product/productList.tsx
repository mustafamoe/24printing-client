import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import useSWR from "swr";
import qs from "qs";

// components
import ProductItem from "./productItem";
import Loader from "../loader";
import { IProduct } from "../../types/product";

const ProductList = ({ search, toggleProductModel }) => {
    const router = useRouter();
    const { category, sub_category } = qs.parse(router.query, {
        ignoreQueryPrefix: true,
    });
    const { data: products } = useSWR<IProduct[]>("/products");
    const [columns, setColumns] = useState(4);
    const [ww, setWw] = useState(0);
    const [state, setState] = useState<any>({
        products: [],
    });

    useEffect(() => {
        setWw(window.innerWidth);
        const getWindowWidth = () => {
            setWw(window.innerWidth);
        };

        window.addEventListener("resize", getWindowWidth);

        return () => {
            window.removeEventListener("resize", getWindowWidth);
        };
    }, []);

    useEffect(() => {
        if (ww < 1650 && ww >= 1320) {
            return setColumns(3);
        }
        if (ww < 1320 && ww >= 1020) {
            return setColumns(2);
        }
        if (ww < 1020 && ww >= 920) {
            return setColumns(3);
        }
        if (ww < 920 && ww >= 620) {
            return setColumns(2);
        }
        if (ww < 620 && ww >= 0) {
            return setColumns(1);
        }
        if (ww > 1650) {
            return setColumns(4);
        }
    }, [ww]);

    useEffect(() => {
        if (products) {
            setState({ ...state, products });
            filterOnCategory();
        }
    }, [products]);

    useEffect(() => {
        if (products) {
            filterOnCategory();
        }
    }, [router.query]);

    useEffect(() => {
        if (products) {
            setState({
                ...state,
                products: [...products].filter((p) =>
                    p.product_name
                        .toLowerCase()
                        .includes(search.toLowerCase().trim())
                ),
            });
        }
    }, [search]);

    const filterOnCategory = () => {
        if (sub_category) {
            return setState({
                ...state,
                products: [...products].filter((p) =>
                    p.sub_category
                        ? p.sub_category.sub_category_id === sub_category
                        : false
                ),
            });
        }
        if (category) {
            setState({
                ...state,
                products: [...products].filter((p) =>
                    p.category ? p.category.category_id === category : false
                ),
            });
        } else {
            setState({ ...state, products });
        }
    };

    const jsx = () => {
        if (products) {
            const productsCopy = [...state.products];
            const n = Math.ceil(productsCopy.length / columns);
            let result = [];

            for (let i = 0; i < columns; i++) {
                result.push([]);
            }

            let active;
            let productCounter = 0;
            for (let i = 0; i < n; i++) {
                active = 0;
                for (let j = 0; j < columns; j++) {
                    if (productsCopy[productCounter]) {
                        result[active].push(productsCopy[productCounter]);
                        productCounter++;
                    }

                    active++;
                }
            }

            return result.map((arr, i) => {
                return (
                    <div key={i} className="product-list-column">
                        {arr.map((product) => (
                            <ProductItem
                                key={product._id}
                                toggleProductModal={toggleProductModel}
                                product={product}
                            />
                        ))}
                    </div>
                );
            });
        }

        return null;
    };

    if (!products)
        return (
            <div className="product-list-loading-container">
                <Loader />
            </div>
        );
    return (
        <div
            className="product-list-container"
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
            {jsx()}
        </div>
    );
};

export default ProductList;

import { useState, useEffect } from "react";
import useSwr from "swr";

// components
import ProductList from "../components/product/productList";
import CategoryList from "../components/category/categoryList";
import BannerSlider from "../components/banner/bannerSlider";
import ProductQuikView from "../components/product/productQuikView";
import HeadLayout from "../components/headLayout";

const Shop = () => {
    const { data: banners } = useSwr("/banners?banner_page=shop");
    const [productModel, setProductModel] = useState(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const toggleProductModel = (product) => {
        if (productModel) {
            document.body.style.overflow = "auto";
            setProductModel(null);
        } else {
            document.body.style.overflow = "hidden";
            setProductModel(product);
        }
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    return (
        <>
            <HeadLayout title="Shop" />
            <div className="shop-page">
                <BannerSlider loop={true} banners={banners} page={"shop"} />
                <div className="shop-search-section">
                    <div className="shop-search-bar-container">
                        <input
                            type="text"
                            placeholder="Search For Products..."
                            value={search}
                            className="shop-search-bar"
                            onChange={handleSearch}
                        />
                        <div className="search-icon-container">
                            <img className="search-icon" src="/search.svg" />
                        </div>
                    </div>
                </div>
                <div className="shop-main-content-container">
                    <CategoryList search={search} />
                    <ProductList
                        search={search}
                        toggleProductModel={toggleProductModel}
                    />
                </div>
            </div>
            {productModel && (
                <ProductQuikView
                    product={productModel}
                    close={toggleProductModel}
                />
            )}
        </>
    );
};

export default Shop;

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import qs from "qs";
import Link from "next/link";
import useSWR from "swr";
import { useRouter } from "next/router";

// components
import Loader from "../loader";
import { ICategory } from "../../types/category";

const ProductCategoryList = ({ search }) => {
    const router = useRouter();
    const { category, sub_category } = qs.parse(router.query, {
        ignoreQueryPrefix: true,
    });
    const { data: categories } = useSWR<ICategory[]>("/categories");
    const [selectedCategory, setCategory] = useState("all");
    const [selectedSubCategory, setSubCategory] = useState(null);
    const [ww, setWw] = useState(0);
    const [isOpen, setOpen] = useState(false);

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

    const toggleCategoryList = () => {
        if (isOpen) {
            setOpen(false);
        } else {
            setOpen(true);
        }
    };

    const categoryListStyles = () => {
        if (isOpen)
            return {
                transform: "translateX(0)",
            };

        return {
            transform: "translateX(-400px)",
        };
    };

    useEffect(() => {
        if (category) {
            handleSelectCategory(category);
        }
        if (sub_category) {
            handleSelectedSubCategory(sub_category);
        } else {
            handleSelectedSubCategory(null);
        }
    }, []);

    useEffect(() => {
        handleSelectCategory("all");
        handleSelectedSubCategory(null);
    }, [search]);

    useEffect(() => {
        if (category) {
            handleSelectCategory(category);
        } else {
            handleSelectCategory("all");
            handleSelectedSubCategory(null);
        }

        if (sub_category) {
            handleSelectedSubCategory(sub_category);
        } else {
            handleSelectedSubCategory(null);
        }
    }, [router.query]);

    const handleSelectCategory = (categoryName) => {
        setCategory(categoryName);
    };

    const handleSelectedSubCategory = (subCategoryName) => {
        setSubCategory(subCategoryName);
    };

    return (
        <>
            {ww < 1020 ? (
                <div className="toggle-category-btn-container">
                    <button
                        onClick={toggleCategoryList}
                        className="toggle-category-btn"
                    >
                        <img
                            className="toggle-category-icon"
                            src="/stack.svg"
                            alt="category"
                        />
                    </button>
                </div>
            ) : null}
            <div
                style={ww < 1020 ? categoryListStyles() : null}
                className="product-category-list-container"
            >
                <div className="product-category-list-heading-container">
                    <p className="product-category-list-heading">
                        product categories
                    </p>
                </div>
                {!categories ? (
                    <Loader />
                ) : (
                    <div className="categoires-list-container">
                        <div className="category-item-content">
                            <Link href={`/shop`}>
                                <a
                                    onClick={
                                        ww < 1020 ? toggleCategoryList : null
                                    }
                                    style={
                                        selectedCategory === "all"
                                            ? {
                                                  backgroundColor:
                                                      "rgb(236, 0, 140)",
                                                  color: "white",
                                              }
                                            : null
                                    }
                                    className="category-item-link"
                                >
                                    all
                                </a>
                            </Link>
                        </div>
                        {categories
                            .sort(
                                (a, b) =>
                                    Number(a.category_order) -
                                    Number(b.category_order)
                            )
                            .map((category) => (
                                <>
                                    {!category.is_hidden && (
                                        <div
                                            key={category.category_id}
                                            className="category-item"
                                        >
                                            <div className="category-item-content">
                                                <Link
                                                    href={`/shop?category=${category.category_id}`}
                                                >
                                                    <a
                                                        onClick={
                                                            ww < 1020
                                                                ? toggleCategoryList
                                                                : null
                                                        }
                                                        style={
                                                            selectedCategory ===
                                                            category.category_id
                                                                ? {
                                                                      backgroundColor:
                                                                          "rgb(236, 0, 140)",
                                                                      color: "white",
                                                                  }
                                                                : null
                                                        }
                                                        className="category-item-link"
                                                    >
                                                        {category.category_name}
                                                    </a>
                                                </Link>
                                            </div>
                                            {selectedCategory ===
                                            category.category_id ? (
                                                <div className="sub-category-list">
                                                    {category.sub_categories
                                                        ?.sort(
                                                            (a, b) =>
                                                                Number(
                                                                    a.sub_category_order
                                                                ) -
                                                                Number(
                                                                    b.sub_category_order
                                                                )
                                                        )
                                                        ?.map((subCategory) => {
                                                            if (
                                                                !subCategory.is_hidden
                                                            )
                                                                return (
                                                                    <div
                                                                        key={
                                                                            subCategory.sub_category_id
                                                                        }
                                                                        className="sub-category-item"
                                                                    >
                                                                        <div className="sub-category-item-content">
                                                                            <Link
                                                                                href={`/shop?category=${category.category_id}&sub_category=${subCategory.sub_category_id}`}
                                                                            >
                                                                                <a
                                                                                    style={
                                                                                        selectedSubCategory ===
                                                                                        subCategory.sub_category_id
                                                                                            ? {
                                                                                                  backgroundColor:
                                                                                                      "rgb(73, 73, 73)",
                                                                                                  color: "white",
                                                                                              }
                                                                                            : null
                                                                                    }
                                                                                    className="sub-category-item-link"
                                                                                >
                                                                                    {
                                                                                        subCategory.sub_category_name
                                                                                    }
                                                                                </a>
                                                                            </Link>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            return null;
                                                        })}
                                                </div>
                                            ) : null}
                                        </div>
                                    )}
                                </>
                            ))}
                    </div>
                )}
            </div>
            {ww < 1020 && isOpen ? (
                <div
                    className="category-list-overlay"
                    onClick={toggleCategoryList}
                ></div>
            ) : null}
        </>
    );
};

export default ProductCategoryList;

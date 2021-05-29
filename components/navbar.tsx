import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { signoutCall } from "../store/actions/user";
import Link from "next/link";
import useCart from "../hooks/useCart";
import ImageOpt from "./imageOpt";
import { RootReducer } from "../store/reducers";
import { useRouter } from "next/router";

const Navbar = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [cart] = useCart();
    const user = useSelector((state: RootReducer) => state.auth.user);
    const [isOpen, setOpen] = useState(false);
    const [ww, setWw] = useState(0);

    useEffect(() => {
        setWw(window.innerWidth);

        const getWindowWidth = () => {
            setWw(window.innerWidth);
            if (window.innerWidth > 1050) setOpen(false);
        };

        window.addEventListener("resize", getWindowWidth);

        return () => {
            window.removeEventListener("resize", getWindowWidth);
        };
    }, []);

    const toggleNavbar = () => {
        document.body.style.overflow = "auto";
        if (isOpen) {
            setOpen(false);
        } else {
            document.body.style.overflow = "hidden";
            setOpen(true);
        }
    };

    const activeClassName = (href: string) => {
        return `/${router.pathname.split("/")[1]}` === href;
    };

    const handleSignOut = () => {
        dispatch(signoutCall());
    };

    const cartProfileJsx = () => {
        return (
            <div style={{ display: "flex" }}>
                {user ? (
                    <li
                        onClick={ww < 1050 && isOpen ? toggleNavbar : null}
                        className="nav-nav-item"
                    >
                        <Link href="/profile">
                            <a className="userinfo-container">
                                <ImageOpt
                                    src={user.avatar?.image_name}
                                    width={50}
                                    height={50}
                                    className="avatar"
                                />
                            </a>
                        </Link>
                    </li>
                ) : null}
                <li
                    onClick={ww < 1050 && isOpen ? toggleNavbar : null}
                    style={{ margin: "0 15px" }}
                    className="nav-nav-item"
                >
                    <div className="cart-counter-container">
                        <Link href="/cart">
                            <a
                                style={
                                    activeClassName("/cart")
                                        ? {
                                              filter: `invert(21%) sepia(72%) saturate(7219%) hue-rotate(313deg) brightness(89%) contrast(114%)`,
                                          }
                                        : null
                                }
                                className="navbar-nav-link"
                            >
                                <p
                                    className="cart-counter"
                                    style={{ top: "0px" }}
                                >
                                    {cart.length}
                                </p>
                                <ImageOpt
                                    location="local"
                                    className="shopping-cart-icon"
                                    src="/cart.svg"
                                    alt="cart"
                                    width={40}
                                    height={35}
                                />
                            </a>
                        </Link>
                    </div>
                </li>
                <li
                    onClick={ww < 1050 && isOpen ? toggleNavbar : null}
                    className="nav-nav-item"
                >
                    <Link href="/wishlist">
                        <a
                            className="navbar-nav-link"
                            style={
                                activeClassName("/wishlist")
                                    ? {
                                          filter: `invert(21%) sepia(72%) saturate(7219%) hue-rotate(313deg) brightness(89%) contrast(114%)`,
                                      }
                                    : null
                            }
                        >
                            <img
                                className="wishlist-icon"
                                src={"/like.svg"}
                                alt="wishlist"
                                width={30}
                                height={30}
                            />
                        </a>
                    </Link>
                </li>
            </div>
        );
    };

    const activeLink = {
        color: "#ec008c",
    };

    const adminLinks = () => {
        if (user) {
            if (
                user.is_super_admin ||
                user.is_admin ||
                user.is_accountant ||
                user.is_customer_service
            )
                return (
                    <li
                        onClick={ww < 1050 && isOpen ? toggleNavbar : null}
                        className="nav-nav-item"
                    >
                        <Link href="/admin">
                            <a
                                className="navbar-nav-link"
                                style={
                                    activeClassName("/admin")
                                        ? activeLink
                                        : null
                                }
                            >
                                admin
                            </a>
                        </Link>
                    </li>
                );
        }

        return null;
    };

    const isOpenStyles = () => {
        if (isOpen)
            return {
                transform: "translateX(0)",
                transition: "all .1s ease",
            };

        return {
            transform: "translateX(120vw)",
            transition: "all .1s ease",
        };
    };

    const burgerLineStyles = (num) => {
        if (!isOpen) {
            if (num === 1) return { transform: "translateX(0) rotate(0deg)" };
            if (num === 3) return { transform: "translateX(0) rotate(0deg)" };
            if (num === 2) return { display: "1" };
        } else {
            if (num === 1)
                return { transform: "translateY(10.5px) rotate(45deg)" };
            if (num === 3)
                return { transform: "translateY(-10.5px) rotate(-45deg)" };
            if (num === 2) return { opacity: "0" };
        }
    };

    const authLinks = () => {
        if (!user)
            return (
                <>
                    <li
                        onClick={ww < 1050 && isOpen ? toggleNavbar : null}
                        className="nav-nav-item"
                    >
                        <Link href="/signin">
                            <a className="button">signin</a>
                        </Link>
                    </li>
                    <li
                        onClick={ww < 1050 && isOpen ? toggleNavbar : null}
                        className="nav-nav-item"
                    >
                        <Link href="/signup">
                            <a className="button">signup</a>
                        </Link>
                    </li>
                </>
            );
        return (
            <li
                onClick={ww < 1050 && isOpen ? toggleNavbar : null}
                className="nav-nav-item"
            >
                <button
                    type="button"
                    className="button"
                    onClick={handleSignOut}
                >
                    sign out
                </button>
            </li>
        );
    };

    return (
        <div className="navbar">
            {ww < 1050 ? cartProfileJsx() : null}
            <div className="navbar-logo">
                <Link href="/">
                    <a>
                        <img
                            style={
                                ww < 550
                                    ? { display: "none" }
                                    : { display: "block" }
                            }
                            src="/24printinglogo.png"
                            className="navbar-log"
                            alt="24printing"
                        />
                        <img
                            style={
                                ww < 550
                                    ? { display: "block" }
                                    : { display: "none" }
                            }
                            className="navbar-smaill-log"
                            src={"/pictoOnly.svg"}
                            alt="24printing"
                        />
                    </a>
                </Link>
            </div>
            {ww < 1050 ? (
                <div onClick={toggleNavbar} className="navbar-burger-container">
                    <div
                        style={burgerLineStyles(1)}
                        className="navbar-burger-line"
                    ></div>
                    <div
                        style={burgerLineStyles(2)}
                        className="navbar-burger-line"
                    ></div>
                    <div
                        style={burgerLineStyles(3)}
                        className="navbar-burger-line"
                    ></div>
                </div>
            ) : null}
            <nav
                className="navbar-nav-wrapper"
                style={ww < 1050 ? isOpenStyles() : null}
            >
                <ul className="navbar-nav-container">
                    <li
                        onClick={ww < 1050 && isOpen ? toggleNavbar : null}
                        className="nav-nav-item"
                    >
                        <Link href="/">
                            <a
                                className="navbar-nav-link"
                                style={activeClassName("/") ? activeLink : null}
                            >
                                home
                            </a>
                        </Link>
                    </li>
                    <li
                        onClick={ww < 1050 && isOpen ? toggleNavbar : null}
                        className="nav-nav-item"
                    >
                        <Link href="/shop">
                            <a
                                className="navbar-nav-link"
                                style={
                                    activeClassName("/shop") ? activeLink : null
                                }
                            >
                                shop
                            </a>
                        </Link>
                    </li>
                    <li
                        onClick={ww < 1050 && isOpen ? toggleNavbar : null}
                        className="nav-nav-item"
                    >
                        <Link href="/contactUs">
                            <a
                                style={
                                    activeClassName("/contactUs")
                                        ? activeLink
                                        : null
                                }
                                className="navbar-nav-link"
                            >
                                contact us
                            </a>
                        </Link>
                    </li>
                    {ww > 1050 ? (
                        <>
                            <li
                                onClick={
                                    ww < 1050 && isOpen ? toggleNavbar : null
                                }
                                className="nav-nav-item"
                            >
                                <Link href="/wishlist">
                                    <a
                                        className="navbar-nav-link"
                                        style={
                                            activeClassName("/wishlist")
                                                ? {
                                                      filter: `invert(21%) sepia(72%) saturate(7219%) hue-rotate(313deg) brightness(89%) contrast(114%)`,
                                                  }
                                                : null
                                        }
                                    >
                                        <ImageOpt
                                            location="local"
                                            className="wishlist-icon"
                                            src="/like.svg"
                                            alt="wishlist"
                                            width={30}
                                            height={30}
                                        />
                                    </a>
                                </Link>
                            </li>
                            <li
                                onClick={
                                    ww < 1050 && isOpen ? toggleNavbar : null
                                }
                                className="nav-nav-item"
                            >
                                <div className="cart-counter-container">
                                    <Link href="/cart">
                                        <a
                                            className="navbar-nav-link"
                                            style={
                                                activeClassName("/cart")
                                                    ? {
                                                          filter: `invert(21%) sepia(72%) saturate(7219%) hue-rotate(313deg) brightness(89%) contrast(114%)`,
                                                      }
                                                    : null
                                            }
                                        >
                                            <p className="cart-counter">
                                                {cart.length}
                                            </p>
                                            <ImageOpt
                                                location="local"
                                                className="shopping-cart-icon"
                                                src="/cart.svg"
                                                alt="cart"
                                                width={40}
                                                height={35}
                                            />
                                        </a>
                                    </Link>
                                </div>
                            </li>
                        </>
                    ) : null}
                    {user && ww > 1050 ? (
                        <li
                            onClick={ww < 1050 ? toggleNavbar : null}
                            className="nav-nav-item"
                        >
                            <Link href="/profile">
                                <a className="userinfo-container">
                                    <p className="navbar-nav-link">
                                        hello, {user.first_name}
                                    </p>
                                    <ImageOpt
                                        src={user.avatar?.image_name}
                                        width={50}
                                        height={50}
                                        className="user-avatar"
                                    />
                                </a>
                            </Link>
                        </li>
                    ) : null}
                    {authLinks()}
                    {adminLinks()}
                </ul>
            </nav>
        </div>
    );
};

export default Navbar;

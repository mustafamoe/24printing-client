import Link from "next/link";
import ImageOpt from "../components/imageOpt";

const Footer = () => {
    return (
        <div className="footer-section">
            <div className="footer-content-wraper">
                <div className="footer-image-section">
                    <div>
                        <p>Managed by:</p>
                        <ImageOpt
                            location="local"
                            className="navbar-logo"
                            width={125.1}
                            height={33.7}
                            src="/inspired-media-logo.svg"
                        />
                        <div style={{ marginTop: "10px" }}>
                            <Link href={`/privacyPolicy`}>
                                <a className="footer-links">
                                    privacy policy, terms of use
                                </a>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="footer-content-section">
                    <div className="footer-content-items footer-description">
                        <div>
                            <ImageOpt
                                location="local"
                                src="/24printinglogo.png"
                                width={200}
                                height={59.77}
                            />
                        </div>
                        <p className="footer-image-description">
                            Twenty Four Printing and Packing was established to
                            provide a fast and reliable printing services, for
                            both Offset & Digital. We are located at M-43
                            Mussafah Industrial Area. Managed by Inspired Media
                            LLC, who has been in the market since 2008.
                        </p>
                    </div>
                    <div className="footer-helpful-links-container">
                        <ul className="footer-helpful-links-wrapper">
                            <li className="footer-link-elements">
                                <Link href="/">
                                    <a className="footer-links">home</a>
                                </Link>
                            </li>
                            <li className="footer-link-elements">
                                <Link href="/shop">
                                    <a className="footer-links">shop</a>
                                </Link>
                            </li>
                            <li className="footer-link-elements">
                                <Link href="/profile">
                                    <a className="footer-links">profile</a>
                                </Link>
                            </li>
                            <li className="footer-link-elements">
                                <Link href="/wishlist">
                                    <a className="footer-links">wishlist</a>
                                </Link>
                            </li>
                            <li className="footer-link-elements">
                                <Link href="/signin">
                                    <a className="footer-links">
                                        Sign in / Sign up
                                    </a>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="footer-content-items wa-cu-container">
                        <div className="footer-social-media-container">
                            <p className="footer-title">contact us</p>
                            <ul>
                                <li className="footer-link-elements">
                                    T: +971 2 441 3882
                                </li>
                                <li className="footer-link-elements">
                                    E: info@24printing.ae
                                </li>
                            </ul>
                            <div>
                                <img
                                    className="socialmedia-icon"
                                    src="/facebook.svg"
                                    alt="facebook"
                                />
                                <img
                                    className="socialmedia-icon"
                                    src="/instagram.svg"
                                    alt="instagram"
                                />
                                <img
                                    className="socialmedia-icon"
                                    src="/whatsapp.svg"
                                    alt="whatsapp"
                                />
                            </div>
                        </div>
                        <div>
                            <p className="footer-title">we accept</p>
                            <div className="social-meida-icons-container">
                                <div className="payment-icon">
                                    <ImageOpt
                                        location="local"
                                        className="payment-icon"
                                        alt="masterCard"
                                        height={30}
                                        width={50}
                                        src="/Mastercard-icon.png"
                                    />
                                </div>
                                <div className="payment-icon">
                                    <ImageOpt
                                        location="local"
                                        className="payment-icon"
                                        height={30}
                                        alt="visa"
                                        src="/VISA-icon.png"
                                        width={50}
                                    />
                                </div>
                                <div className="payment-icon">
                                    <ImageOpt
                                        location="local"
                                        className="payment-icon"
                                        height={30}
                                        width={50}
                                        alt="cod"
                                        src="/COD-icon.png"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer-copyrights-container">
                <p className="copyright-text">
                    Copyright © 2021 Twenty Four Printing Packing L.L.C, All
                    rights reserved. Powered by{" "}
                    <span>
                        <a
                            className="cpmc-link"
                            href="https://crownphoenixadv.com/"
                        >
                            crown phoenix marketing consultancy L.L.C
                        </a>
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Footer;

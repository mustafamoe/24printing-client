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
                                <a
                                    target="_blank"
                                    href="https://www.facebook.com/24-Printing-UAE-101561342047365/"
                                >
                                    <img
                                        className="socialmedia-icon"
                                        src="/fb.svg"
                                        alt="facebook"
                                    />
                                </a>
                                <a
                                    target="_blank"
                                    href="https://www.instagram.com/24printinguae/"
                                >
                                    <img
                                        className="socialmedia-icon"
                                        src="/ins.svg"
                                        alt="instagram"
                                    />
                                </a>
                                <a
                                    target="_blank"
                                    href="https://api.whatsapp.com/send/?phone=971503614667&app_absent=0"
                                >
                                    <img
                                        className="socialmedia-icon"
                                        src="/wa.svg"
                                        alt="whatsapp"
                                    />
                                </a>
                            </div>
                        </div>
                        <div>
                            <p className="footer-title">we accept</p>
                            <div className="social-meida-icons-container">
                                <div style={{ display: "flex" }}>
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
            </div>
            <div className="footer-copyrights-container">
                <Link href={`/privacyPolicy`}>
                    <a
                        style={{
                            color: "rgb(204, 204, 204)",
                            whiteSpace: "nowrap",
                        }}
                    >
                        privacy policy,
                        <span> terms of use</span>
                    </a>
                </Link>
                <p className="copyright-text">
                    Copyright © 2021 Twenty Four Printing Packing LLC, All
                    rights reserved. - Powered by{" "}
                    <a
                        className="cpmc-link"
                        href="https://crownphoenixadv.com/"
                    >
                        Crown Phoenix Marketing Consultancy LLC
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Footer;

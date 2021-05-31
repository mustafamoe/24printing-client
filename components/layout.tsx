import Navbar from "./navbar";
import Footer from "./footer";
import HeadLayout from "./headLayout";
import { useRouter } from "next/router";
import ContactBtn from "./contactBtn";
import useSwr from "swr";

// icons
import CloseIcon from "@material-ui/icons/Close";
import { useState } from "react";
import { apiImage } from "../utils/apiCall";
import { IAdvPopup } from "../types/advPopup";

interface Props {
    children?: React.ReactNode;
}

const AdvPopupModel = () => {
    const { data: advPopup } = useSwr<IAdvPopup>("/adv_popup");
    const router = useRouter();
    const [open, setOpen] = useState(true);

    if (!open) return null;
    if (advPopup)
        return (
            <div className="adv-popup-model">
                <div className="admin-popup-model-close-container">
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="close-model-btn"
                        style={{ width: "50px", height: "50px" }}
                    >
                        <CloseIcon
                            className="close-model-icon"
                            style={{ width: "50px", height: "50px" }}
                        />
                    </button>
                </div>
                <div className="adv-popup-model-img-container">
                    <img
                        onClick={() =>
                            advPopup.link ? router.push(advPopup.link) : null
                        }
                        className="adv-popup-model-img"
                        src={apiImage(advPopup.image.image_name)}
                        alt=""
                    />
                    {console.log(apiImage(advPopup.image.image_name))}
                </div>
            </div>
        );
    return null;
};

const Layout = ({ children }: Props) => {
    const router = useRouter();

    if (`/${router.pathname.split("/")[1]}` === "/admin")
        return <>{children}</>;
    else if (`/${router.pathname.split("/")[1]}` === "/chat")
        return <>{children}</>;
    else
        return (
            <div style={{ paddingTop: "74px" }}>
                <HeadLayout>
                    <>
                        <meta
                            name="author"
                            content="CPMC (Crown Phoenix Marketing Consultancy L.L.C)"
                        />
                        <meta
                            name="viewport"
                            content="width=device-width, initial-scale=1.0"
                        ></meta>
                    </>
                </HeadLayout>
                <Navbar />
                {children}
                <ContactBtn />
                <AdvPopupModel />
                <Footer />
            </div>
        );
};

export default Layout;

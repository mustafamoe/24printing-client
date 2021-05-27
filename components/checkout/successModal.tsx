import { Box } from "@material-ui/core";
import React, { useEffect } from "react";

// components
import Modal from "../admin/modal";
import ImageOpt from "../imageOpt";

const CheckoutSuccessModel = ({ close }) => {
    useEffect(() => {
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    return (
        <Modal type="parent" closeInfo={{ close, check: false }}>
            <div className="purchase-success-wrapper">
                <p className="purchase-success-greeting">thank you!</p>
                <div className="purchase-success-text-container">
                    <p className="success-text">
                        your purchase was successful.
                    </p>
                    <Box ml={2}>
                        <ImageOpt
                            src="/success.svg"
                            alt="success"
                            location="local"
                            width={40}
                            height={40}
                        />
                    </Box>
                </div>
            </div>
        </Modal>
    );
};

export default CheckoutSuccessModel;

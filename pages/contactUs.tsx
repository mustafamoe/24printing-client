import { useState } from "react";
import ImageOpt from "../components/imageOpt";
import { apiCall } from "../utils/apiCall";
import Button from "@material-ui/core/Button";

// components
import HeadLayout from "../components/headLayout";
import Error from "../components/admin/error";
import CircularProgress from "@material-ui/core/CircularProgress";

interface IError {
    name: string[];
    subject: string[];
    phone: string[];
    email: string[];
    message: string[];
}

const ContactUs = () => {
    const [successMsg, setSuccessMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<IError>({
        name: [],
        subject: [],
        phone: [],
        email: [],
        message: [],
    });
    const [state, setState] = useState({
        name: "",
        message: "",
        email: "",
        phone: "",
        subject: "",
    });

    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!loading) {
            const errors = handleValidate();

            for (let e of Object.values(errors)) {
                if (e.length) return;
            }

            try {
                setLoading(true);
                const { message } = await apiCall<any>(
                    "post",
                    `/contact_us`,
                    state
                );

                setState({
                    name: "",
                    message: "",
                    email: "",
                    phone: "",
                    subject: "",
                });
                setTimeout(() => {
                    setSuccessMsg("");
                }, 5000);
                setSuccessMsg(message);
                setLoading(false);
            } catch (err) {
                setLoading(false);
                setErrors({ ...errors, ...err });
            }
        }
    };

    const handleValidate = () => {
        const TmpErrors: IError = {
            name: [],
            email: [],
            phone: [],
            subject: [],
            message: [],
        };

        if (!state.name) {
            TmpErrors.name.push("Please fill in product name.");
        }

        if (!state.phone) {
            TmpErrors.phone.push("Please fill in product description.");
        }

        if (!state.email) {
            TmpErrors.email.push("Please fill in about this product.");
        }

        if (!state.subject) {
            TmpErrors.subject.push("Please choose an image.");
        }

        if (!state.message.length) {
            TmpErrors.message.push("Please choose at least one image.");
        }

        setErrors({ ...errors, ...TmpErrors });

        return TmpErrors;
    };

    return (
        <>
            <HeadLayout title="Contact Us" />
            <div className="contactus-page">
                <div className="contactus-heading-container">
                    <h1 className="contactus-heading">contact us</h1>
                </div>
                <div className="contactus-main-section-container">
                    <form onSubmit={handleSubmit} className="contact-form">
                        <div className="contactus-inputs-container">
                            <div className="form-input-container">
                                <label className="form-label" htmlFor="name">
                                    name
                                </label>
                                <input
                                    type="text"
                                    className="form-input"
                                    id="name"
                                    placeholder="name"
                                    name="name"
                                    value={state.name}
                                    onChange={handleChange}
                                />
                                <Error errors={errors.name} />
                            </div>
                            <div className="form-input-container">
                                <label className="form-label" htmlFor="phone">
                                    phone
                                </label>
                                <input
                                    type="text"
                                    className="form-input"
                                    id="phone"
                                    placeholder="phone"
                                    name="phone"
                                    value={state.phone}
                                    onChange={handleChange}
                                />
                                <Error errors={errors.phone} />
                            </div>
                            <div className="form-input-container">
                                <label className="form-label" htmlFor="email">
                                    email
                                </label>
                                <input
                                    type="text"
                                    className="form-input"
                                    id="email"
                                    placeholder="email"
                                    name="email"
                                    value={state.email}
                                    onChange={handleChange}
                                />
                                <Error errors={errors.email} />
                            </div>
                            <div className="form-input-container">
                                <label className="form-label" htmlFor="subject">
                                    subject
                                </label>
                                <input
                                    type="text"
                                    className="form-input"
                                    id="subject"
                                    placeholder="subject"
                                    name="subject"
                                    value={state.subject}
                                    onChange={handleChange}
                                />
                                <Error errors={errors.subject} />
                            </div>
                        </div>
                        <div className="form-input-container">
                            <label className="form-label" htmlFor="message">
                                message
                            </label>
                            <textarea
                                className="form-input form-textarea"
                                id="message"
                                name="message"
                                placeholder="message"
                                value={state.message}
                                onChange={handleChange}
                            ></textarea>
                            <Error errors={errors.message} />
                        </div>
                        {successMsg ? (
                            <div>
                                <p className="contactus-success-msg">
                                    {successMsg}
                                </p>
                            </div>
                        ) : null}
                        <Button
                            type="submit"
                            disabled={loading}
                            fullWidth
                            variant="contained"
                            color="secondary"
                        >
                            {loading ? (
                                <CircularProgress
                                    style={{
                                        color: "white",
                                        width: "30px",
                                        height: "30px",
                                    }}
                                />
                            ) : (
                                "submit"
                            )}
                        </Button>
                    </form>
                    <div className="contactus-middle-line"></div>
                    <div className="contactus-info-container">
                        <div className="contactus-info-heading-container">
                            <h1 className="contactus-info-heading">
                                information
                            </h1>
                            <div style={{ margin: "20px 0" }}>
                                <iframe
                                    title="24printing"
                                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d29080.738002341426!2d54.474284!3d24.343279!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xf2e55e1a7138da5!2s24%20Printing%20%26%20Packing%20LLC!5e0!3m2!1sen!2sus!4v1623832998820!5m2!1sen!2sus"
                                    width="100%"
                                    height="450"
                                    frameBorder="0"
                                    style={{ border: "none" }}
                                    allowFullScreen={false}
                                    aria-hidden="false"
                                    tabIndex={0}
                                ></iframe>
                            </div>
                            <div>
                                <div className="contact-us-icon-container">
                                    <div className="cs-icon-container">
                                        <ImageOpt
                                            location="local"
                                            className="company-info-img"
                                            src="/placeholder.svg"
                                            alt="location"
                                            width={20}
                                            height={20}
                                        />
                                    </div>
                                    <p className="contactus-info-item">
                                        M-43, Corner 7th and - 16th St -
                                        MusaffahICAD I - Abu Dhabi
                                    </p>
                                </div>
                                <div className="contact-us-icon-container">
                                    <div className="cs-icon-container">
                                        <ImageOpt
                                            location="local"
                                            className="company-info-img"
                                            width={20}
                                            src="/email.svg"
                                            alt="email"
                                            height={20}
                                        />
                                    </div>
                                    <p className="contactus-info-item ltr-dir">
                                        info@24printing.ae
                                    </p>
                                </div>
                                <div className="contact-us-icon-container">
                                    <div className="cs-icon-container">
                                        <ImageOpt
                                            location="local"
                                            className="company-info-img"
                                            width={20}
                                            height={20}
                                            src="/phone-call.svg"
                                            alt="phone number"
                                        />
                                    </div>
                                    <p className="contactus-info-item ltr-dir">
                                        02 441 3882
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContactUs;

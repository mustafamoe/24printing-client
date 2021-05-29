import { useState } from "react";
import ImageOpt from "../components/imageOpt";
import { apiCall } from "../utils/apiCall";

// components
import HeadLayout from "../components/headLayout";

const ContactUs = () => {
    const [successMsg, setSuccessMsg] = useState("");
    const [state, setState] = useState({
        name: "",
        message: "",
        email: "",
        phone: "",
        subject: "",
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendEmail();
    };

    const sendEmail = async () => {
        try {
            setError(null);
            setSuccessMsg("");
            await apiCall("post", `/api/contactus_send_email`, state);
            setState({
                ...state,
                name: "",
                message: "",
                email: "",
                phone: "",
                subject: "",
            });

            setSuccessMsg("thank you for contacting us!");
        } catch (err) {
            setError(err);
        }
    };

    const errorMessage = (fieldName) => {
        if (error) {
            if (error[fieldName])
                return (
                    <div className="error-msg-container">
                        <p className="error-msg">{error[fieldName]}</p>
                    </div>
                );
        }
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
                        {successMsg ? (
                            <div>
                                <p className="contactus-success-msg">
                                    {successMsg}
                                </p>
                            </div>
                        ) : null}
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
                                {errorMessage("name")}
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
                                {errorMessage("phone")}
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
                                {errorMessage("email")}
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
                                {errorMessage("subject")}
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
                            {errorMessage("message")}
                        </div>
                        <button className="button" type="submit">
                            submit
                        </button>
                    </form>
                    <div className="contactus-middle-line"></div>
                    <div className="contactus-info-container">
                        <div className="contactus-info-heading-container">
                            <h1 className="contactus-info-heading">
                                information
                            </h1>
                            <div style={{ margin: "20px 0" }}>
                                <iframe
                                    title="inspired media location"
                                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d454.00541895109086!2d54.399595!3d24.4492812!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5e684258419e59%3A0xdfaece3d2e5d5963!2sInspired%20Media%20UAE!5e0!3m2!1sen!2sae!4v1613229256608!5m2!1sen!2sae"
                                    width="600"
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

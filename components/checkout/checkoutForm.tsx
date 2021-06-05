import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    CardElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";
import { apiCall } from "../../utils/apiCall";
import useCart from "../../hooks/useCart";
import {
    CircularProgress,
    Button,
    Stepper,
    Tabs,
    Box,
    Step,
    StepLabel,
    Tab,
    Typography,
} from "@material-ui/core";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

// components
import { RootReducer } from "../../store/reducers";
import useSWR from "swr";
import { IAddress } from "../../types/address";
import ImageOpt from "../imageOpt";

// Setup Stripe.js and the Elements provider
const stripePromise = loadStripe(process.env.STRIPE_PK);

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            color: "#32325d",
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": {
                color: "#aab7c4",
            },
        },
        invalid: {
            color: "#fa755a",
            iconColor: "#fa755a",
        },
    },
};

const a11yProps = (index: any) => {
    return {
        id: `wrapped-tab-${index}`,
        "aria-controls": `wrapped-tabpanel-${index}`,
    };
};

interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: any;
    value: any;
}

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && <Box mt={3}>{children}</Box>}
        </div>
    );
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: "100%",
        },
        backButton: {
            marginRight: theme.spacing(1),
        },
        instructions: {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
        },
    })
);

const steps = ["Delivery address", "Payment method"];

const Stripe = ({ openModel }) => {
    const classes = useStyles();
    const [cart] = useCart();
    const user = useSelector((state: RootReducer) => state.auth.user);
    const { data: addresses } = useSWR<IAddress[]>(
        `/addresses?authId=${user.user_id}`
    );
    const [errors, setError] = useState({});
    const stripe = useStripe();
    const elements = useElements();
    const [activeAddress, setAddress] = useState<IAddress | null>(null);
    const [loading, setLoading] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [activeTab, setActiveTab] = useState(0);
    const [state, setState] = useState({
        email: "",
        name: "",
        phone: "",
        address_line1: "",
        address_line2: "",
        address_city: "",
        address_zip: "",
        address_country: "UAE",
    });

    const handleTab = (event: React.ChangeEvent<{}>, newValue: number) => {
        setActiveTab(newValue);
    };

    useEffect(() => {
        if (user) {
            setState({
                ...state,
                name: `${user.first_name} ${user.last_name}`,
                email: user.email,
                phone: user.phone,
            });
        }
    }, [user]);

    const handleSetAddress = (address: IAddress) => {
        if (activeAddress) {
            if (address.address_id === activeAddress.address_id) {
                return setAddress(null);
            }
        }

        setError({
            ...errors,
            address_line1: null,
            address_line2: null,
            address_city: null,
            address_zip: null,
        });

        setAddress(address);
    };

    // Handle real-time validation errors from the card Element.
    const handleChange = (event) => {
        if (event.error) {
            setError({ ...errors, stripe: event.error.message });
        } else {
            setError({ ...errors, stripe: null });
        }
    };

    // Handle form submission.
    const handleSubmit = async (e) => {
        e.preventDefault();

        const tmpState = { ...state };
        if (activeAddress) {
            tmpState.address_line1 = activeAddress.line_1;
            tmpState.address_line2 = activeAddress.line_2;
            tmpState.address_city = activeAddress.city;
            tmpState.address_zip = String(activeAddress.zip_code);
        }

        if (activeTab === 1) {
            try {
                setLoading(true);

                await apiCall("post", `/checkout?authId=${user.user_id}`, {
                    type: "cod",
                    token: {
                        ...tmpState,
                        phone: state.phone,
                        activeAddress: activeAddress ? true : false,
                    },
                    cart: ([...cart] as any).map((p) => {
                        delete p.product;
                        return p;
                    }),
                });

                setLoading(false);
                openModel();
            } catch (err) {
                setLoading(false);
                setError({ ...errors, ...err });
            }

            return;
        }

        setLoading(true);
        const card = elements.getElement(CardElement);
        const result: any = await stripe.createToken(card, tmpState);

        if (result.error) {
            // Inform the user if there was an error.
            setError({ ...errors, stripe: result.error.message });
        } else {
            result.token.phone = state.phone;
            result.token.activeAddress = activeAddress ? true : false;

            try {
                await apiCall("post", `/checkout?authId=${user.user_id}`, {
                    type: "payment",
                    token: result.token,
                    cart: ([...cart] as any).map((p) => {
                        delete p.product;
                        return p;
                    }),
                });

                setLoading(false);
                openModel();
            } catch (err) {
                setLoading(false);
                setError({ ...errors, ...err });
            }
        }
    };

    const handleInputChange = (e) => {
        if (!e.target.value) {
            setState({ ...state, [e.target.name]: e.target.value });
            setError({
                ...errors,
                [e.target.name]: `${e.target.name.replace(
                    "_",
                    " "
                )} is required.`,
            });
        } else {
            setState({ ...state, [e.target.name]: e.target.value });
            setError({ ...errors, [e.target.name]: null });
        }
    };

    const errorMsg = (fieldName) => {
        if (errors) {
            if (errors[fieldName])
                return (
                    <div className="error-message-container" role="alert">
                        <p className="error-message-text">
                            {errors[fieldName]}
                        </p>
                    </div>
                );
        }
    };

    const handleNext = () => {
        if (activeStep === 0) {
            let errors = {};
            for (let [k, v] of Object.entries(state)) {
                if (activeAddress) {
                    if (k.includes("address")) continue;
                }
                if (!v) errors[k] = `${k.replace("_", " ")} is required.`;
                else delete errors[k];
            }

            if (Object.keys(errors).length) return setError(errors);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return (
        <>
            <div className="checkout-form-container">
                {errorMsg("purchaseError")}
                <form className="checkout-form" onSubmit={handleSubmit}>
                    <div className={classes.root}>
                        <Stepper activeStep={activeStep} alternativeLabel>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        <div>
                            {activeStep === steps.length ? null : (
                                <div>
                                    <Box>
                                        {activeStep === 0 ? (
                                            <>
                                                <div className="form-input-container">
                                                    <label
                                                        className="form-label"
                                                        htmlFor="name"
                                                    >
                                                        full name
                                                    </label>
                                                    <input
                                                        id="name"
                                                        className="form-input"
                                                        type="text"
                                                        name="name"
                                                        placeholder="name"
                                                        value={state.name}
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                    />
                                                    {errorMsg("name")}
                                                </div>
                                                <div className="form-input-container">
                                                    <label
                                                        className="form-label"
                                                        htmlFor="email"
                                                    >
                                                        email
                                                    </label>
                                                    <input
                                                        id="email"
                                                        className="form-input"
                                                        type="text"
                                                        name="email"
                                                        placeholder="email"
                                                        value={state.email}
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                    />
                                                    {errorMsg("email")}
                                                </div>
                                                <div className="form-input-container">
                                                    <label
                                                        className="form-label"
                                                        htmlFor="phone"
                                                    >
                                                        phone
                                                    </label>
                                                    <input
                                                        id="phone"
                                                        className="form-input"
                                                        type="text"
                                                        name="phone"
                                                        placeholder="phone number"
                                                        value={state.phone}
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                    />
                                                    {errorMsg("phone")}
                                                </div>
                                                {user &&
                                                    (addresses &&
                                                    addresses.length ? (
                                                        <div>
                                                            <div className="checkout-addresses-heading-container">
                                                                <p className="checkout-addresses-heading">
                                                                    your
                                                                    addresses
                                                                </p>
                                                            </div>
                                                            <div className="checkout-addresses-container">
                                                                {addresses.map(
                                                                    (
                                                                        address
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                address.address_id
                                                                            }
                                                                            style={
                                                                                activeAddress
                                                                                    ? activeAddress.address_id ===
                                                                                      address.address_id
                                                                                        ? {
                                                                                              borderColor:
                                                                                                  "rgb(236, 0, 140)",
                                                                                          }
                                                                                        : null
                                                                                    : null
                                                                            }
                                                                            onClick={() =>
                                                                                handleSetAddress(
                                                                                    address
                                                                                )
                                                                            }
                                                                            className="checkout-address-container"
                                                                        >
                                                                            <p className="checkout-address-text">
                                                                                {
                                                                                    address.line_1
                                                                                }

                                                                                ,
                                                                            </p>
                                                                            <p className="checkout-address-text">
                                                                                {
                                                                                    address.line_2
                                                                                }

                                                                                ,
                                                                            </p>
                                                                            <p className="checkout-address-text">
                                                                                {
                                                                                    address.city
                                                                                }

                                                                                ,
                                                                            </p>
                                                                            <p className="checkout-address-text">
                                                                                {
                                                                                    address.zip_code
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    ) : null)}
                                                {!activeAddress && (
                                                    <>
                                                        <div className="checkout-line-container">
                                                            <div
                                                                className="checkout-addres-line-container"
                                                                style={{
                                                                    display:
                                                                        "flex",
                                                                    width: "100%",
                                                                }}
                                                            >
                                                                <div
                                                                    className="form-input-container checkout-line-container"
                                                                    style={{
                                                                        marginRight:
                                                                            "20px",
                                                                    }}
                                                                >
                                                                    <label
                                                                        className="form-label"
                                                                        htmlFor="line_1"
                                                                    >
                                                                        address
                                                                        line 1
                                                                    </label>
                                                                    <input
                                                                        id="line_1"
                                                                        className="form-input"
                                                                        type="text"
                                                                        name="address_line1"
                                                                        placeholder="address lin1"
                                                                        value={
                                                                            state.address_line1
                                                                        }
                                                                        onChange={
                                                                            handleInputChange
                                                                        }
                                                                    />
                                                                    {errorMsg(
                                                                        "address_line1"
                                                                    )}
                                                                </div>
                                                                <div className="form-input-container checkout-line-container">
                                                                    <label
                                                                        className="form-label"
                                                                        htmlFor="line_2"
                                                                    >
                                                                        address
                                                                        line 2
                                                                    </label>
                                                                    <input
                                                                        id="line_2"
                                                                        className="form-input"
                                                                        type="text"
                                                                        name="address_line2"
                                                                        placeholder="address lin2"
                                                                        value={
                                                                            state.address_line2
                                                                        }
                                                                        onChange={
                                                                            handleInputChange
                                                                        }
                                                                    />
                                                                    {errorMsg(
                                                                        "address_line2"
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="csz-container">
                                                            <div className="form-input-container">
                                                                <label
                                                                    className="form-label"
                                                                    htmlFor="city"
                                                                >
                                                                    city
                                                                </label>
                                                                <input
                                                                    id="city"
                                                                    className="form-input"
                                                                    type="text"
                                                                    name="address_city"
                                                                    placeholder="address city"
                                                                    value={
                                                                        state.address_city
                                                                    }
                                                                    onChange={
                                                                        handleInputChange
                                                                    }
                                                                />
                                                                {errorMsg(
                                                                    "address_city"
                                                                )}
                                                            </div>
                                                            <div className="form-input-container">
                                                                <label
                                                                    className="form-label"
                                                                    htmlFor="zip"
                                                                >
                                                                    zip/postal
                                                                    code
                                                                </label>
                                                                <input
                                                                    id="zip"
                                                                    className="form-input"
                                                                    type="text"
                                                                    name="address_zip"
                                                                    placeholder="zip/postal code"
                                                                    value={
                                                                        state.address_zip
                                                                    }
                                                                    onChange={
                                                                        handleInputChange
                                                                    }
                                                                />
                                                                {errorMsg(
                                                                    "address_zip"
                                                                )}
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </>
                                        ) : null}
                                        {activeStep === 1 ? (
                                            <>
                                                <Box width="100%">
                                                    <Tabs
                                                        value={activeTab}
                                                        centered
                                                        indicatorColor="primary"
                                                        textColor="primary"
                                                        onChange={handleTab}
                                                        aria-label="disabled tabs example"
                                                    >
                                                        <Tab
                                                            style={{
                                                                width: "100%",
                                                            }}
                                                            label="Credit card"
                                                            {...a11yProps(
                                                                "payment"
                                                            )}
                                                        />
                                                        <Tab
                                                            style={{
                                                                width: "100%",
                                                            }}
                                                            label="Cash on delivery"
                                                            {...a11yProps(
                                                                "cod"
                                                            )}
                                                        />
                                                    </Tabs>
                                                </Box>
                                                <TabPanel
                                                    value={activeTab}
                                                    index={0}
                                                >
                                                    <div
                                                        className="form-row checkout-card-input-container"
                                                        style={{
                                                            margin: "20px 0",
                                                        }}
                                                    >
                                                        <div className="checkout-card-input-wrapper">
                                                            <CardElement
                                                                id="card-element"
                                                                options={
                                                                    CARD_ELEMENT_OPTIONS
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                            />
                                                        </div>
                                                        <div className="checkout-card-icons-contaienr">
                                                            <div className="payment-icon">
                                                                <ImageOpt
                                                                    alt=""
                                                                    src="/Mastercard-icon.png"
                                                                    width={50}
                                                                    location="local"
                                                                    height={30}
                                                                />
                                                            </div>
                                                            <div className="payment-icon">
                                                                <ImageOpt
                                                                    className="payment-icon"
                                                                    alt=""
                                                                    src="/VISA-icon.png"
                                                                    width={50}
                                                                    location="local"
                                                                    height={30}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {errorMsg("stripe")}
                                                </TabPanel>
                                                <TabPanel
                                                    value={activeTab}
                                                    index={1}
                                                >
                                                    <Box
                                                        display="flex"
                                                        alignItems="center"
                                                        justifyContent="center"
                                                        mb={3}
                                                    >
                                                        <Box mr={2}>
                                                            <ImageOpt
                                                                location="local"
                                                                src="/cash-on-delivery.svg"
                                                                width={50}
                                                                height={50}
                                                            />
                                                        </Box>
                                                        <Typography>
                                                            You will be charged
                                                            on delivery.
                                                        </Typography>
                                                    </Box>
                                                </TabPanel>
                                                <Button
                                                    disabled={loading}
                                                    variant="contained"
                                                    color="primary"
                                                    type="submit"
                                                    fullWidth
                                                >
                                                    {loading ? (
                                                        <CircularProgress color="secondary" />
                                                    ) : (
                                                        "place order"
                                                    )}
                                                </Button>
                                            </>
                                        ) : null}
                                    </Box>
                                    <Box mt={5}>
                                        <Button
                                            disabled={activeStep === 0}
                                            onClick={handleBack}
                                            className={classes.backButton}
                                        >
                                            Back
                                        </Button>
                                        {activeStep !== steps.length - 1 ? (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleNext}
                                            >
                                                Next
                                            </Button>
                                        ) : null}
                                    </Box>
                                </div>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

const CheckoutForm = ({ openModal }) => {
    return (
        <Elements stripe={stripePromise}>
            <Stripe openModel={openModal} />
        </Elements>
    );
};

export default CheckoutForm;

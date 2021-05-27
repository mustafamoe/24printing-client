import { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import {
    Typography,
    Button,
    Box,
    CircularProgress,
    Divider,
} from "@material-ui/core";
import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import LuxonUtils from "@date-io/luxon";
import { apiCall } from "../../../utils/apiCall";
import { mutate } from "swr";
import { RootReducer } from "../../../store/reducers";
import { useSelector } from "react-redux";

// components
import Modal from "../modal";
import Error from "../error";
import { IQuantity } from "../../../types/quantity";
import { IProduct } from "../../../types/product";
import { IDiscount } from "../../../types/discount";

interface IProps {
    close: Function;
    product: IProduct;
}

interface IState {
    duration: Date | null;
    quantities: IQuantity[];
}

interface IError {
    duration: string[];
    quantities: string[];
}

const DiscountForm = ({ close, product }: IProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const user = useSelector((state: RootReducer) => state.auth.user);
    const [state, setState] = useState<IState>({
        duration: new Date(),
        quantities: [],
    });
    const [errors, setErrors] = useState<IError>({
        duration: [],
        quantities: [],
    });

    useEffect(() => {
        setState({
            ...state,
            quantities: product.discount
                ? (product.discount.quantities as unknown as IQuantity[])
                : product.quantities,
        });
    }, []);

    const handlePrice = (e, id) => {
        if (!e.target.value) {
            setState({
                ...state,
                quantities: state.quantities.map((q) =>
                    q.quantity_id === id ? { ...q, [e.target.name]: 0 } : q
                ),
            });

            return;
        }

        if (!Number.isNaN(Number(e.target.value))) {
            setState({
                ...state,
                quantities: state.quantities.map((q) =>
                    q.quantity_id === id
                        ? { ...q, [e.target.name]: e.target.value.trim() }
                        : q
                ),
            });
        }
    };

    const handleDateChange = (date: Date | null) => {
        setState({ ...state, duration: date });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!loading) {
            const errors = handleValidate();

            for (let e of Object.values(errors)) {
                if (e.length) return;
            }

            try {
                if (!product.discount) {
                    setLoading(true);
                    const discount = await apiCall(
                        "post",
                        `/discount?authId=${user.user_id}&productId=${product.product_id}`,
                        state
                    );

                    mutate(
                        "/products",
                        (products) => {
                            return products.map((p) =>
                                p.product_id !== product.product_id
                                    ? p
                                    : { ...p, discount }
                            );
                        },
                        false
                    );
                } else {
                    setLoading(true);
                    const editedDiscount = await apiCall<IDiscount>(
                        "put",
                        `/discount/${product.discount.discount_id}?authId=${user.user_id}`,
                        state
                    );

                    mutate(
                        "/products",
                        (products) => {
                            return products.map((p) =>
                                p.product_id !== product.product_id
                                    ? p
                                    : { ...p, discount: editedDiscount }
                            );
                        },
                        false
                    );
                }
                close();
            } catch (err) {
                setLoading(false);
                setErrors({ ...errors, ...err });
            }
        }
    };

    const handleValidate = () => {
        const TmpErrors: IError = {
            duration: [],
            quantities: [],
        };

        if (!state.duration) {
            TmpErrors.duration.push("Please choose duration.");
        }

        setErrors({ ...errors, ...TmpErrors });

        return TmpErrors;
    };

    return (
        <>
            <Modal
                type="parent"
                width={50}
                closeInfo={{
                    close,
                    check: true,
                }}
            >
                <form onSubmit={handleSubmit} noValidate autoComplete="off">
                    <div>
                        <Box>
                            {state.quantities.map((q) => (
                                <Box
                                    key={q.quantity_id}
                                    mt={3}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="space-between"
                                >
                                    <Box width="20%">
                                        <Typography
                                            style={{
                                                textAlign: "center",
                                                fontWeight: 500,
                                            }}
                                        >
                                            Quantity: {q.qty}
                                        </Typography>
                                    </Box>
                                    <Box width="20%">
                                        <Typography
                                            style={{
                                                textAlign: "center",
                                                fontWeight: 500,
                                            }}
                                        >
                                            Price:{" "}
                                            {
                                                product.quantities.find(
                                                    (qty) =>
                                                        qty.quantity_id ===
                                                        q.quantity_id
                                                )?.price
                                            }
                                        </Typography>
                                    </Box>
                                    <Box mr={2} ml={2} width="60%">
                                        <TextField
                                            name="price"
                                            label="Discount Price"
                                            required={true}
                                            size="small"
                                            value={q.price}
                                            variant="outlined"
                                            onChange={(e) =>
                                                handlePrice(e, q.quantity_id)
                                            }
                                            fullWidth
                                        />
                                    </Box>
                                </Box>
                            ))}
                            <Error errors={errors.quantities} />
                        </Box>
                        <Box mb={3} mt={3}>
                            <Divider />
                        </Box>
                        <Box>
                            <MuiPickersUtilsProvider utils={LuxonUtils}>
                                <KeyboardDatePicker
                                    margin="normal"
                                    name="duration"
                                    id="duration"
                                    label="Discount duration"
                                    format="MM/dd/yyyy"
                                    value={state.duration}
                                    onChange={handleDateChange}
                                    KeyboardButtonProps={{
                                        "aria-label": "change date",
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                            <Error errors={errors.duration} />
                        </Box>
                        <Box
                            display="flex"
                            flexDirection="column"
                            style={{ marginTop: "20px" }}
                        >
                            <Button
                                color="secondary"
                                type="submit"
                                variant="contained"
                            >
                                {loading ? (
                                    <CircularProgress
                                        style={{ color: "white" }}
                                    />
                                ) : (
                                    "Submit"
                                )}
                            </Button>
                        </Box>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default DiscountForm;

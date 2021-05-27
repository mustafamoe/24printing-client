import { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import {
    Button,
    Box,
    CircularProgress,
    Divider,
    FormControl,
    RadioGroup,
    FormControlLabel,
    FormLabel,
    Radio,
} from "@material-ui/core";
import { apiCall } from "../../../utils/apiCall";
import { mutate } from "swr";
import { RootReducer } from "../../../store/reducers";
import { useSelector } from "react-redux";

// components
import Modal from "../modal";
import Error from "../error";
import { IOrder, IOrderStatus } from "../../../types/order";

interface IProps {
    close: Function;
    order?: IOrder;
}

interface IState {
    status: IOrderStatus;
    expected_date: string | null;
}

interface IError {
    status: string[];
    expected_date: string[];
}

const OrderForm = ({ close, order }: IProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const user = useSelector((state: RootReducer) => state.auth.user);
    const [state, setState] = useState<IState>({
        status: "reviewing",
        expected_date: null,
    });
    const [errors, setErrors] = useState<IError>({
        status: [],
        expected_date: [],
    });

    useEffect(() => {
        if (order) {
            setState({
                ...state,
                status: order.status,
                expected_date: new Date(
                    new Date().toString().split("GMT")[0] + " UTC"
                )
                    .toISOString()
                    .split(".")[0],
            });
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                if (!order) {
                    setLoading(true);
                    const order = await apiCall(
                        "post",
                        `/orders?authId=${user.user_id}`,
                        state
                    );

                    mutate(
                        `/orders?authId=${user.user_id}`,
                        (orders) => {
                            return [order, ...orders];
                        },
                        false
                    );
                } else {
                    setLoading(true);
                    const editedOrder = await apiCall<IOrder>(
                        "put",
                        `/order/${order.order_id}?authId=${user.user_id}`,
                        state
                    );

                    mutate(
                        `/orders?authId=${user.user_id}`,
                        (orders: IOrder[]) => {
                            return orders?.map((o) =>
                                o.order_id !== order.order_id ? o : editedOrder
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
            status: [],
            expected_date: [],
        };

        if (!state.status) {
            TmpErrors.status.push("Please choose order status.");
        }

        if (!state.expected_date) {
            TmpErrors.expected_date.push("Please enter expected date.");
        }

        setErrors({ ...errors, ...TmpErrors });

        return TmpErrors;
    };

    return (
        <>
            <Modal
                type="parent"
                width={40}
                closeInfo={{
                    close,
                    check: true,
                }}
            >
                <form onSubmit={handleSubmit} noValidate autoComplete="off">
                    <div>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">
                                Order status
                            </FormLabel>
                            <RadioGroup
                                aria-label="order status"
                                name="status"
                                value={state.status}
                                onChange={handleChange}
                            >
                                <FormControlLabel
                                    value="reviewing"
                                    control={<Radio />}
                                    label="Reviewing"
                                />
                                <FormControlLabel
                                    value="approved"
                                    control={<Radio />}
                                    label="Approved"
                                />
                                <FormControlLabel
                                    value="under process"
                                    control={<Radio />}
                                    label="Under Process"
                                />
                                <FormControlLabel
                                    value="ready to ship"
                                    control={<Radio />}
                                    label="Ready To Ship"
                                />
                                <FormControlLabel
                                    value="completed"
                                    control={<Radio />}
                                    label="Completed"
                                />
                            </RadioGroup>
                        </FormControl>
                        <Box mb={3} mt={3}>
                            <Divider />
                        </Box>
                        <Box mb={3}>
                            <TextField
                                name="expected_date"
                                label="Expected date"
                                size="small"
                                value={state.expected_date}
                                type="datetime-local"
                                variant="standard"
                                onChange={handleChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <Error errors={errors.expected_date} />
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

export default OrderForm;

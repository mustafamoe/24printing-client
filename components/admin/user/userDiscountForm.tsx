import { useState, useEffect } from "react";
import { IUserDiscount } from "../../../types/userDiscount";
import {
    Button,
    Box,
    CircularProgress,
    TextField,
    Divider,
    createStyles,
    makeStyles,
    Theme,
    InputAdornment,
} from "@material-ui/core";
import { apiCall } from "../../../utils/apiCall";
import { mutate } from "swr";
import { RootReducer } from "../../../store/reducers";
import { useSelector } from "react-redux";
import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import LuxonUtils from "@date-io/luxon";

// components
import Error from "../error";
import Modal from "../modal";
import { IUser } from "../../../types/user";

interface IProps {
    close: Function;
    userDiscount?: IUserDiscount;
    userId: string;
}

interface IState {
    percentage: number;
    duration: Date;
}

interface IError {
    percentage: string[];
    duration: string[];
}

const UserDiscountForm = ({ close, userDiscount, userId }: IProps) => {
    const classes = useStyles();
    const [loading, setLoading] = useState<boolean>(false);
    const user = useSelector((state: RootReducer) => state.auth.user);
    const [state, setState] = useState<IState>({
        percentage: 0,
        duration: new Date(),
    });
    const [errors, setErrors] = useState<IError>({
        percentage: [],
        duration: [],
    });

    // _____________________________________ seed state with user discount if exists
    useEffect(() => {
        if (userDiscount) {
            setState({
                ...state,
                percentage: userDiscount.percentage,
                duration: userDiscount.duration,
            });
        }
    }, []);

    // _____________________________________ field handlers
    const handleChangeNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (!Number.isNaN(Number(value)) && Number(value) <= 100) {
            setState({
                ...state,
                [e.target.name]: value.trim().split(".", 1)[0],
            });
        }
    };

    const handleDateChange = (date: Date | null) => {
        setState({ ...state, duration: date });
    };

    // _____________________________________ add / save
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!loading) {
            const errors = handleValidate();

            for (let e of Object.values(errors)) {
                if (e.length) return;
            }

            try {
                setLoading(true);

                if (!userDiscount) {
                    const discount = await apiCall(
                        "post",
                        `/user_discount/user/${userId}?authId=${user.user_id}`,
                        state
                    );

                    mutate(
                        `/users?authId=${user.user_id}`,
                        (users: IUser[]) => {
                            return users.map((u) =>
                                u.user_id === userId ? { ...u, discount } : u
                            );
                        },
                        false
                    );
                } else {
                    const discount = await apiCall(
                        "put",
                        `/user_discount/${userDiscount.user_discount_id}?authId=${user.user_id}`,
                        state
                    );

                    mutate(
                        `/users?authId=${user.user_id}`,
                        (users: IUser[]) => {
                            return users.map((u) =>
                                u.user_id === userId ? { ...u, discount } : u
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
            percentage: [],
            duration: [],
        };

        if (!state.percentage) {
            TmpErrors.percentage.push("Please fill in percentage.");
        }

        if (!state.duration) {
            TmpErrors.duration.push("Please choose discount duration.");
        }

        setErrors({ ...errors, ...TmpErrors });

        return TmpErrors;
    };

    return (
        <Modal width={40} type="parent" closeInfo={{ close, check: true }}>
            <form onSubmit={handleSubmit}>
                <Box mt={2}>
                    <TextField
                        label="Discount duration"
                        variant="outlined"
                        size="small"
                        name="percentage"
                        value={state.percentage}
                        onChange={handleChangeNumber}
                        error={!!errors.percentage.length}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="start">
                                    %
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Error errors={errors.percentage} />
                </Box>
                <Box mt={3} mb={3}>
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
                        />
                    </MuiPickersUtilsProvider>
                    <Error errors={errors.duration} />
                </Box>
                <Box
                    display="flex"
                    flexDirection="column"
                    style={{ marginTop: "20px" }}
                >
                    <Button color="secondary" type="submit" variant="contained">
                        {loading ? (
                            <CircularProgress style={{ color: "white" }} />
                        ) : (
                            "Submit"
                        )}
                    </Button>
                </Box>
            </form>
        </Modal>
    );
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            display: "flex",
            flexWrap: "wrap",
        },
        textField: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            width: 200,
        },
    })
);

export default UserDiscountForm;

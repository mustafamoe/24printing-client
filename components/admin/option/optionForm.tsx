import { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import {
    Button,
    Box,
    CircularProgress,
    Divider,
    Typography,
} from "@material-ui/core";
import { apiCall } from "../../../utils/apiCall";
import { mutate } from "swr";
import { RootReducer } from "../../../store/reducers";
import { useSelector } from "react-redux";

// components
import Modal from "../modal";
import Error from "../error";
import { IOption } from "../../../types/option";

interface IProps {
    close: Function;
    option?: IOption;
}

interface IState {
    option_name: string;
}

interface IError {
    option_name: string[];
}

const AdvPopupForm = ({ close, option }: IProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const user = useSelector((state: RootReducer) => state.auth.user);
    const [state, setState] = useState<IState>({
        option_name: "",
    });
    const [errors, setErrors] = useState<IError>({
        option_name: [],
    });

    useEffect(() => {
        if (option) {
            setState({
                ...state,
                option_name: option.option_name || "",
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
                if (!option) {
                    setLoading(true);
                    const option = await apiCall(
                        "post",
                        `/option?authId=${user.user_id}`,
                        state
                    );

                    mutate(
                        "/options",
                        (options) => {
                            return [...options, option];
                        },
                        false
                    );
                } else {
                    setLoading(true);
                    const editedAdvPopup = await apiCall(
                        "put",
                        `/option/${option.option_id}?authId=${user.user_id}`,
                        state
                    );

                    mutate(
                        "/options",
                        (options) => {
                            return options.map((ap) =>
                                ap.option_id !== option.option_id
                                    ? ap
                                    : editedAdvPopup
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
            option_name: [],
        };

        if (!state.option_name) {
            TmpErrors.option_name.push("Please fill in option name.");
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
                        <Box mb={5}>
                            <Typography variant="h5">Option form</Typography>
                        </Box>
                        <Box mb={3}>
                            <TextField
                                name="option_name"
                                label="Option name"
                                size="small"
                                value={state.option_name}
                                variant="outlined"
                                onChange={handleChange}
                                fullWidth
                            />
                            <Error errors={errors.option_name} />
                        </Box>
                        <Box mb={3} mt={3}>
                            <Divider />
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

export default AdvPopupForm;

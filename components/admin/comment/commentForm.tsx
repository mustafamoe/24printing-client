import { useState, useEffect } from "react";
import { RootReducer } from "../../../store/reducers";
import { useSelector } from "react-redux";
import {
    Switch,
    Button,
    Box,
    TextField,
    CircularProgress,
    Divider,
    Typography,
} from "@material-ui/core";
import { mutate } from "swr";
import { apiCall } from "../../../utils/apiCall";

// components
import Error from "../error";
import { IComment } from "../../../types/comment";
import { IOrder } from "../../../types/order";

interface IState {
    text: string;
    is_private: boolean;
}

interface IError {
    text: string[];
}

interface IProps {
    orderId: string;
    comment?: IComment;
}

const OrderCommentForm = ({ orderId, comment }: IProps) => {
    const user = useSelector((state: RootReducer) => state.auth.user);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<IError>({
        text: [],
    });
    const [state, setState] = useState<IState>({
        text: "",
        is_private: true,
    });

    useEffect(() => {
        if (comment) {
            setState({
                ...state,
                text: comment.text,
                is_private: comment.is_private,
            });
        }
    }, []);

    const handleSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };

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
                if (!comment) {
                    setLoading(true);
                    const comment = await apiCall(
                        "post",
                        `/comment?authId=${user.user_id}&orderId=${orderId}`,
                        state
                    );
                    mutate(
                        `/order/${orderId}?authId=${user.user_id}`,
                        (order: IOrder) => {
                            return {
                                ...order,
                                comments: [comment, ...order.comments],
                            };
                        },
                        false
                    );
                } else {
                    setLoading(true);
                    const editedComment = await apiCall(
                        "put",
                        `/comment/${comment.comment_id}?authId=${user.user_id}&orderId=${orderId}`,
                        state
                    );

                    mutate(
                        `/order/${orderId}?auth_id=${user.user_id}`,
                        (order: IOrder) => {
                            return {
                                ...order,
                                comments: order.comments.map((c) =>
                                    c.comment_id === comment.comment_id
                                        ? editedComment
                                        : c
                                ),
                            };
                        },
                        false
                    );
                }

                close();
                setLoading(false);
            } catch (err) {
                setLoading(false);
                setErrors({ ...errors, ...err });
            }
        }
    };

    const handleValidate = () => {
        const TmpErrors: IError = {
            text: [],
        };

        if (!state.text) {
            TmpErrors.text.push("Please fill in text.");
        }

        setErrors({ ...errors, ...TmpErrors });

        return TmpErrors;
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <Box mb={3} mt={3}>
                    <Divider />
                </Box>
                <Box mb={3}>
                    <TextField
                        name="text"
                        label={`Add a  ${
                            state.is_private ? "private" : "public"
                        } comment...`}
                        size="medium"
                        value={state.text}
                        variant="standard"
                        onChange={handleChange}
                        fullWidth
                    />
                    <Error errors={errors.text} />
                </Box>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    style={{ marginTop: "20px" }}
                >
                    <Box display="flex" alignItems="center">
                        <Box mr={1}>
                            <Typography variant="h6">Private</Typography>
                        </Box>
                        <Switch
                            checked={state.is_private}
                            onChange={handleSwitch}
                            name="is_private"
                        />
                    </Box>
                    <Box>
                        <Button
                            color="secondary"
                            type="submit"
                            variant="contained"
                        >
                            {loading ? (
                                <CircularProgress
                                    style={{
                                        color: "white",
                                        width: "20px",
                                        height: "20px",
                                    }}
                                />
                            ) : (
                                "Submit"
                            )}
                        </Button>
                    </Box>
                </Box>
            </form>
        </div>
    );
};

export default OrderCommentForm;

import { useState, useEffect } from "react";
import { signupCall, signupRemoveError } from "../store/actions/user";
import { useDispatch, useSelector } from "react-redux";
import {
    TextField,
    CircularProgress,
    Button,
    Typography,
    Box,
    useTheme,
} from "@material-ui/core";
import { RootReducer } from "../store/reducers";
import Link from "next/link";
import Error from "../components/admin/error";
import WithoutSignin from "../hocs/withoutSignin";

// components
import HeadLayout from "../components/headLayout";

const Signup = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { error, loading } = useSelector(
        (state: RootReducer) => state.auth.signup
    );

    const [state, setState] = useState({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
        phone: "",
        password2: "",
    });

    useEffect(() => {
        return () => {
            dispatch(signupRemoveError());
        };
    }, []);

    const handelChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    const handelSubmit = (e) => {
        e.preventDefault();

        dispatch(signupCall(state));
    };

    return (
        <>
            <HeadLayout title="Signup" />
            <WithoutSignin>
                <div className="signup-page">
                    <form className="signin-form" onSubmit={handelSubmit}>
                        {typeof error !== "object" ? (
                            <Box mb={2}>
                                <Error errors={[error]} />
                            </Box>
                        ) : null}
                        <Box display="flex">
                            <Box flexGrow={1} mb={2}>
                                <TextField
                                    size="small"
                                    type="text"
                                    variant="outlined"
                                    className="form-input"
                                    label="First name"
                                    name="first_name"
                                    value={state.first_name}
                                    error={!!error?.first_name?.length}
                                    onChange={handelChange}
                                />
                                <Error errors={error?.first_name || []} />
                            </Box>
                            <Box flexGrow={1} ml={2} mb={2}>
                                <TextField
                                    size="small"
                                    type="text"
                                    variant="outlined"
                                    className="form-input"
                                    label="Last name"
                                    error={!!error?.last_name?.length}
                                    name="last_name"
                                    value={state.last_name}
                                    onChange={handelChange}
                                />
                                <Error errors={error?.last_name || []} />
                            </Box>
                        </Box>
                        <Box mb={2}>
                            <TextField
                                size="small"
                                type="text"
                                variant="outlined"
                                className="form-input"
                                label="Username"
                                name="username"
                                error={!!error?.username?.length}
                                value={state.username}
                                onChange={handelChange}
                            />
                            <Error errors={error?.username || []} />
                        </Box>
                        <Box mb={2}>
                            <TextField
                                size="small"
                                type="text"
                                variant="outlined"
                                className="form-input"
                                label="Email"
                                name="email"
                                error={!!error?.email?.length}
                                value={state.email}
                                onChange={handelChange}
                            />
                            <Error errors={error?.email || []} />
                        </Box>
                        <Box mb={2}>
                            <TextField
                                size="small"
                                type="phone"
                                variant="outlined"
                                className="form-input"
                                label="Phone number"
                                name="phone"
                                error={!!error?.phone?.length}
                                value={state.phone}
                                onChange={handelChange}
                            />
                            <Error errors={error?.phone || []} />
                        </Box>
                        <Box mb={2}>
                            <TextField
                                size="small"
                                variant="outlined"
                                label="Password"
                                type="password"
                                className="form-input"
                                name="password"
                                error={!!error?.password?.length}
                                value={state.password}
                                onChange={handelChange}
                            />
                            <Error errors={error?.password || []} />
                        </Box>
                        <Box>
                            <TextField
                                size="small"
                                variant="outlined"
                                type="password"
                                className="form-input"
                                label="Verify Password"
                                name="password2"
                                error={!!error?.password2?.length}
                                value={state.password2}
                                onChange={handelChange}
                            />
                            <Error errors={error?.password2 || []} />
                        </Box>
                        <Box mt={3} mb={1}>
                            <Typography>
                                Already have an account?
                                <span
                                    style={{
                                        color: `${theme.palette.secondary.main}`,
                                        textDecoration: "underline",
                                    }}
                                >
                                    <Link href={"/signin"}>
                                        <a>SIGNIN</a>
                                    </Link>
                                </span>
                            </Typography>
                        </Box>
                        <Box display="flex">
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                            >
                                {loading ? (
                                    <CircularProgress
                                        style={{ color: "white" }}
                                    />
                                ) : (
                                    "signup"
                                )}
                            </Button>
                        </Box>
                    </form>
                </div>
            </WithoutSignin>
        </>
    );
};

export default Signup;

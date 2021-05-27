import { useState, useEffect } from "react";
import {
    TextField,
    CircularProgress,
    Button,
    Typography,
    Box,
    useTheme,
} from "@material-ui/core";
import {
    signinCall,
    // activateAccountEmailCall,
    signinRemoveError,
} from "../store/actions/user";
import { useSelector, useDispatch } from "react-redux";
import { RootReducer } from "../store/reducers";
import Link from "next/link";
import Error from "../components/admin/error";
import WithoutSignin from "../hocs/withoutSignin";

const Signin = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootReducer) => state.auth);

    const { userId } = useSelector((state: RootReducer) => state.auth.signup);
    const theme = useTheme();
    const { error, loading } = useSelector(
        (state: RootReducer) => state.auth.signin
    );

    useEffect(() => {
        return () => {
            dispatch(signinRemoveError());
        };
    }, []);

    const [state, setState] = useState({
        identifier: "",
        password: "",
    });

    const handelSubmit = (e) => {
        e.preventDefault();

        dispatch(signinCall(state));
        setState({ ...state, password: "" });
    };

    const handelChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    const handleActivateAccountEmail = () => {
        // dispatch(activateAccountEmailCall(userID));
    };

    return (
        <WithoutSignin>
            <div className="sigin-page">
                <form className="signin-form" onSubmit={handelSubmit}>
                    {typeof error !== "object" ? (
                        <Box mb={2}>
                            <Error errors={[error]} />
                        </Box>
                    ) : null}
                    <Box mb={2}>
                        <TextField
                            size="small"
                            type="text"
                            variant="outlined"
                            className="form-input"
                            id="identity"
                            label="Email or username"
                            name="identifier"
                            value={state.identifier}
                            onChange={handelChange}
                        />
                    </Box>
                    <Box>
                        <TextField
                            size="small"
                            variant="outlined"
                            label="Password"
                            type="password"
                            className="form-input"
                            id="password"
                            name="password"
                            value={state.password}
                            onChange={handelChange}
                        />
                    </Box>
                    {userId ? (
                        <div className="signin-resend-email-container">
                            <p className="signin-resend-email-msg">
                                didn't recive an email?
                            </p>
                            <button
                                type="button"
                                className="signin-resend-email"
                                onClick={handleActivateAccountEmail}
                            >
                                resend
                            </button>
                        </div>
                    ) : (
                        <Box mt={3} mb={1}>
                            <Typography>
                                Don't have an account?
                                <span
                                    style={{
                                        color: `${theme.palette.secondary.main}`,
                                        textDecoration: "underline",
                                    }}
                                >
                                    <Link href={"/signup"}>
                                        <a>SIGNUP</a>
                                    </Link>
                                </span>
                            </Typography>
                        </Box>
                    )}
                    <Box display="flex">
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                        >
                            {loading ? (
                                <CircularProgress style={{ color: "white" }} />
                            ) : (
                                "signin"
                            )}
                        </Button>
                    </Box>
                </form>
            </div>
        </WithoutSignin>
    );
};

export default Signin;

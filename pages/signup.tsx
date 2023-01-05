import { useState } from "react";
import {
    TextField,
    CircularProgress,
    Button,
    Typography,
    useTheme,
    Box,
} from "@material-ui/core";
import Link from "next/link";
import Error from "../components/admin/error";
import WithoutSignin from "../hocs/withoutSignin";
import { apiCall } from "../utils/apiCall";

// components
import HeadLayout from "../components/headLayout";
import ImageOpt from "../components/imageOpt";

interface IError {
    all: string;
    first_name: string[];
    last_name: string[];
    username: string[];
    email: string[];
    password: string[];
    phone: string[];
    password2: string[];
}

const Signup = () => {
    const theme = useTheme();
    const [user, setUser] = useState<string | null>(null);
    const [timer, setTimer] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<IError>({
        all: "",
        first_name: [],
        last_name: [],
        username: [],
        email: [],
        password: [],
        phone: [],
        password2: [],
    });

    const [state, setState] = useState({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
        phone: "",
        password2: "",
    });

    const handelChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = handleValidate();

        for (let e of Object.values(errors)) {
            if (e.length) return;
        }

        if (!loading) {
            try {
                setLoading(true);
                const { user_id } = await apiCall<any>(
                    "post",
                    `/auth/signup`,
                    state
                );

                setUser(user_id);
                setLoading(false);
            } catch (err) {
                setLoading(false);
                setErrors({ ...errors, ...err });
            }
        }
    };

    const handleValidate = () => {
        const TmpErrors: IError = {
            all: "",
            first_name: [],
            last_name: [],
            username: [],
            email: [],
            phone: [],
            password: [],
            password2: [],
        };

        if (!state.first_name)
            TmpErrors.first_name.push("Please fill in first name.");

        if (!state.last_name)
            TmpErrors.last_name.push("Please fill in last name.");

        if (!state.username)
            TmpErrors.username.push("Please fill in username.");

        if (!state.email) TmpErrors.email.push("Please fill in email.");

        if (!state.phone) TmpErrors.phone.push("Please fill in phone.");

        if (!state.password)
            TmpErrors.password.push("Please fill in password.");

        if (!state.password2)
            TmpErrors.password2.push("Please fill in verify password.");

        setErrors({ ...errors, ...TmpErrors });

        return TmpErrors;
    };

    const resendEmail = async () => {
        setTimer(60);

        const i = setInterval(() => {
            setTimer((prevState) => {
                if (!((prevState as number) - 1)) clearInterval(i);
                return prevState - 1;
            });
        }, 1000);

        try {
            await apiCall(
                "post",
                `/auth/resend_activate_account_email/${user}`
            );
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <HeadLayout title="Signup" />
            <WithoutSignin>
                <div className="signup-page">
                    {user ? (
                        <Box
                            width="700px"
                            maxWidth="90%"
                            padding="30px 50px 30px 50px"
                            borderRadius={5}
                            style={{ textAlign: "center" }}
                            boxShadow={8}
                        >
                            <Box
                                width={130}
                                style={{
                                    margin: "-100px auto 30px auto",
                                    backgroundColor: "white",
                                }}
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                height={130}
                                borderRadius="50%"
                                boxShadow={5}
                            >
                                <ImageOpt
                                    location="local"
                                    src="/pictoOnly.svg"
                                    width={90}
                                    height={90}
                                />
                            </Box>
                            <Typography variant="h4">
                                Please verify your email.
                            </Typography>
                            <Box mt={3} mb={3}>
                                <Typography>
                                    You are almost there, We have sent an email
                                    to
                                </Typography>
                                <Typography>
                                    <b>{state.email}</b>
                                </Typography>
                            </Box>
                            <Box mb={5}>
                                <Typography>
                                    Just follow the steps in the email to
                                    complete your signup. If you don't see it,
                                    you may need to check your spam folder.
                                </Typography>
                            </Box>
                            <Box mb={3}>
                                <Box mb={1}>
                                    <Typography>
                                        Still can't find the email?
                                    </Typography>
                                </Box>
                                <Button
                                    onClick={resendEmail}
                                    variant="contained"
                                    color="secondary"
                                    disabled={timer ? true : false}
                                >
                                    {!timer ? "resend email" : timer}
                                </Button>
                            </Box>
                            <Box>
                                <Typography>
                                    Need help?{" "}
                                    <Link href="/contactUs">
                                        <a>Contact us</a>
                                    </Link>
                                </Typography>
                            </Box>
                        </Box>
                    ) : (
                        <form className="signin-form" onSubmit={handleSubmit}>
                            {typeof errors !== "object" ? (
                                <Box mb={2}>
                                    <Error errors={[errors]} />
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
                                        error={!!errors?.first_name?.length}
                                        onChange={handelChange}
                                    />
                                    <Error errors={errors?.first_name || []} />
                                </Box>
                                <Box flexGrow={1} ml={2} mb={2}>
                                    <TextField
                                        size="small"
                                        type="text"
                                        variant="outlined"
                                        className="form-input"
                                        label="Last name"
                                        error={!!errors?.last_name?.length}
                                        name="last_name"
                                        value={state.last_name}
                                        onChange={handelChange}
                                    />
                                    <Error errors={errors?.last_name || []} />
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
                                    error={!!errors?.username?.length}
                                    value={state.username}
                                    onChange={handelChange}
                                />
                                <Error errors={errors?.username || []} />
                            </Box>
                            <Box mb={2}>
                                <TextField
                                    size="small"
                                    type="text"
                                    variant="outlined"
                                    className="form-input"
                                    label="Email"
                                    name="email"
                                    error={!!errors?.email?.length}
                                    value={state.email}
                                    onChange={handelChange}
                                />
                                <Error errors={errors?.email || []} />
                            </Box>
                            <Box mb={2}>
                                <TextField
                                    size="small"
                                    type="phone"
                                    variant="outlined"
                                    className="form-input"
                                    label="Phone number"
                                    name="phone"
                                    error={!!errors?.phone?.length}
                                    value={state.phone}
                                    onChange={handelChange}
                                />
                                <Error errors={errors?.phone || []} />
                            </Box>
                            <Box mb={2}>
                                <TextField
                                    size="small"
                                    variant="outlined"
                                    label="Password"
                                    type="password"
                                    className="form-input"
                                    name="password"
                                    error={!!errors?.password?.length}
                                    value={state.password}
                                    onChange={handelChange}
                                />
                                <Error errors={errors?.password || []} />
                            </Box>
                            <Box>
                                <TextField
                                    size="small"
                                    variant="outlined"
                                    type="password"
                                    className="form-input"
                                    label="Verify Password"
                                    name="password2"
                                    error={!!errors?.password2?.length}
                                    value={state.password2}
                                    onChange={handelChange}
                                />
                                <Error errors={errors?.password2 || []} />
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
                    )}
                </div>
            </WithoutSignin>
        </>
    );
};

export default Signup;

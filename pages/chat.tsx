import {
    Box,
    makeStyles,
    Typography,
    Button,
    CircularProgress,
    TextField,
    Divider,
} from "@material-ui/core";
import { getSocket } from "../utils/socket";
import { useEffect, useState, useRef, useReducer } from "react";
import { useSelector } from "react-redux";
import { RootReducer } from "../store/reducers";
import { IMessage } from "../types/chat";
import { Agent } from "../types/agent";

// components
import HeadLayout from "../components/headLayout";
import Footer from "../components/admin/chat/footer";
import MessageItem from "../components/admin/chat/messageItem";
import Error from "../components/admin/error";
import classes from "*.module.css";
import ImageOpt from "../components/imageOpt";
import { IUser } from "../types/user";

const socket = getSocket();

const useStyle = makeStyles({
    root: {
        width: "100%",
        height: "100vh",
        display: "flex",
    },
    chatSection: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        maxHeight: "100%",
        position: "relative",
    },
    msgListRoot: {
        padding: "20px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        height: "calc(100% - 100px)",
        overflowY: "auto",
    },
    waitCon: {
        display: "flex",
        height: "100vh",
    },
    waitTxt: {
        display: "block",
        margin: "auto",
        textAlign: "center",
    },
    loadingCont: {
        display: "flex",
        width: "100vw",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
    },
    userInfoRoot: {
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        overflowY: "auto",
        padding: "50px",
    },
});

const INITIAL_STATE: { messages: IMessage[]; agent: Agent | null } = {
    messages: [],
    agent: null,
};

const reducer = (
    state: { messages: IMessage[]; agent: Agent | null },
    action
) => {
    switch (action.type) {
        case "NEW_MESSAGE":
            return { ...state, messages: [...state.messages, action.message] };
        case "AGENT_JOIN":
            return { ...state, agent: action.agent };
        default:
            return state;
    }
};

interface IState {
    fullName: string;
    email: string;
    phone: number | null;
}

interface IError {
    fullName: string[];
    email: string[];
    phone: string[];
}

interface IUserInfoProps {
    handleAddUser: any;
    loading: boolean;
}

const UserInfo = ({ loading, handleAddUser }: IUserInfoProps) => {
    const classes = useStyle();
    const [state, setState] = useState<IState>({
        fullName: "",
        email: "",
        phone: null,
    });
    const [errors, setErrors] = useState<IError>({
        fullName: [],
        email: [],
        phone: [],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        const errors = handleValidate();

        for (let e of Object.values(errors)) {
            if (e.length) return;
        }

        handleAddUser({ ...state, user_id: Date.now() });
    };

    const handleValidate = () => {
        const TmpErrors: IError = {
            fullName: [],
            email: [],
            phone: [],
        };

        if (!state.fullName) {
            TmpErrors.fullName.push("Please fill in your full name.");
        }

        if (!state.email) {
            TmpErrors.email.push("Please fill in your email.");
        }

        if (!state.phone) {
            TmpErrors.phone.push("Please fill in your phone number.");
        }

        setErrors({ ...errors, ...TmpErrors });

        return TmpErrors;
    };

    return (
        <Box>
            {loading ? (
                <Box className={classes.loadingCont}>
                    <CircularProgress
                        style={{
                            width: "50px",
                            height: "50px",
                            color: "rgb(165, 0, 98)",
                        }}
                    />
                </Box>
            ) : (
                <Box className={classes.userInfoRoot}>
                    <Box display="flex" justifyContent="center" mb={5}>
                        <ImageOpt
                            src="/24printinglogo.png"
                            width={200}
                            height={60}
                            alt="24printing"
                            location="local"
                        />
                    </Box>
                    <Box mb={3}>
                        <TextField
                            name="fullName"
                            label="Full name"
                            size="small"
                            value={state.fullName}
                            variant="standard"
                            onChange={handleChange}
                            fullWidth
                        />
                        <Error errors={errors.fullName} />
                    </Box>
                    <Box mb={3}>
                        <TextField
                            name="email"
                            label="Email"
                            size="small"
                            value={state.email}
                            variant="standard"
                            onChange={handleChange}
                            fullWidth
                        />
                        <Error errors={errors.email} />
                    </Box>
                    <Box mb={3}>
                        <TextField
                            name="phone"
                            label="Phone number"
                            size="small"
                            value={state.phone}
                            variant="standard"
                            onChange={handleChange}
                            fullWidth
                        />
                        <Error errors={errors.phone} />
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
                            onClick={handleSubmit}
                        >
                            submit
                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

const Chat = () => {
    const classes = useStyle();
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
    const {
        user: stateUser,
        onload: { loading },
    } = useSelector((state: RootReducer) => state.auth);
    const anchor = useRef<any>(null);
    const [isReady, setReady] = useState(false);
    const [user, setUser] = useState<IUser | null>();
    const [type, setType] = useState<"auth" | "guest">("auth");

    useEffect(() => {
        if (isReady) {
            socket.connect();

            socket.emit("customer:join", {
                user,
                type: type,
            });

            socket.on("customer:agent-join", ({ agent, message }) => {
                dispatch({ type: "NEW_MESSAGE", message });
                dispatch({ type: "AGENT_JOIN", agent });
            });

            socket.on("customer:greet", ({ message }) => {
                dispatch({ type: "NEW_MESSAGE", message });
            });

            socket.on("dashboard:msg-customer", ({ message }) => {
                dispatch({ type: "NEW_MESSAGE", message });
            });

            socket.on("customer:msg-agent", ({ message }) => {
                dispatch({ type: "NEW_MESSAGE", message });
            });

            socket.on("customer:close-chat", () => {
                close();
            });

            setReady(false);
        }
    }, [isReady]);

    // disconnect socket
    useEffect(() => {
        return () => {
            socket.close();
        };
    }, []);

    useEffect(() => {
        if (stateUser) {
            setUser(stateUser);
            setReady(true);
        }
    }, [stateUser]);

    useEffect(() => {
        if (anchor.current) anchor.current.scrollIntoView();
    }, [state.messages]);

    const handleSendMsg = (txt: string) => {
        socket.emit("customer:msg-agent", {
            txt,
            agentSokId: state.agent.socketId,
            userId: user.user_id,
        });
    };

    const handleAddUser = (user: any) => {
        setUser(user);
        setType("guest");
        setReady(true);
    };

    return (
        <>
            <HeadLayout title="Chat" />
            <Box className={classes.root}>
                {!user ? (
                    <UserInfo handleAddUser={handleAddUser} loading={loading} />
                ) : (
                    <Box className={classes.chatSection}>
                        <Box className={classes.msgListRoot}>
                            {state.messages.map((msg) => (
                                <MessageItem
                                    key={msg.message_id}
                                    message={msg}
                                    isOwner={
                                        msg.user?.user_id === user.user_id
                                            ? true
                                            : false
                                    }
                                />
                            ))}
                            <div ref={anchor}></div>
                        </Box>
                        {state.agent ? (
                            <Footer handleSendMsg={handleSendMsg} />
                        ) : null}
                    </Box>
                )}
            </Box>
        </>
    );
};

export default Chat;

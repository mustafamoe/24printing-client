import { Box, makeStyles } from "@material-ui/core";
import { getSocket } from "../../utils/socket";
import { useEffect, useState, useRef, useReducer } from "react";
import { useSelector } from "react-redux";
import { RootReducer } from "../../store/reducers";
import { IChat, IMessage } from "../../types/chat";

// components
import AdminLayout from "../../components/admin/adminLayout";
import HeadLayout from "../../components/headLayout";
import Sidebar from "../../components/admin/chat/sidebar";
import Footer from "../../components/admin/chat/footer";
import Navbar from "../../components/admin/chat/navbar";
import { Customer } from "../../types/customer";
import MessageList from "../../components/admin/chat/messageList";

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            style={{
                display: value === index ? "flex" : "none",
                flexDirection: "column",
                width: "100%",
                height: "100%",
                maxHeight: "100%",
                position: "relative",
            }}
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            <>{children}</>
        </div>
    );
};

const socket = getSocket();

const useStyle = makeStyles({
    root: {
        width: "100%",
        height: "calc(100vh - 50px)",
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
});

const INITIAL_STATE: {
    messages: IMessage[];
    chat: IChat;
    activeCustomers: { user: Customer; messages: IMessage[] }[];
} = {
    messages: [],
    chat: {
        customers: [],
        agents: [],
    },
    activeCustomers: [],
};

const reducer = (
    state: {
        messages: IMessage[];
        chat: IChat;
        activeCustomers: { user: Customer; messages: IMessage[] }[];
    },
    action
) => {
    switch (action.type) {
        case "NEW_MESSAGE":
            return { ...state, messages: [...state.messages, action.message] };
        case "GET_CHAT":
            const tmpChat = { ...action.chat };

            return {
                ...state,
                chat: {
                    ...tmpChat,
                    agents: tmpChat.agents.filter(
                        (a) => a.user.user_id !== action.userId
                    ),
                },
            };
        case "NEW_AGENT":
            return {
                ...state,
                chat: {
                    ...state.chat,
                    agents: [...state.chat.agents, action.newUser].filter(
                        (c) => c.user.user_id !== action.user_id
                    ),
                },
            };
        case "REMOVE_AGENT":
            return {
                ...state,
                chat: {
                    ...state.chat,
                    agents: state.chat.agents.filter(
                        (c) => c.user.user_id !== action.userId
                    ),
                },
            };
        case "NEW_CUSTOMER":
            const tmpNewCust = state.chat.customers.find(
                (u) => u.user.user_id === action.newCustomer.user_id
            );

            if (!tmpNewCust) {
                return {
                    ...state,
                    chat: {
                        ...state.chat,
                        customers: [
                            ...state.chat.customers,
                            action.newCustomer,
                        ],
                    },
                };
            }

            return state;
        case "CONNECT_CUSTOMER":
            return {
                ...state,
                activeCustomers: [
                    ...state.activeCustomers,
                    { ...action.newCustomer, messages: [] },
                ],
                chat: {
                    ...state.chat,
                    customers: state.chat.customers.filter(
                        (c) =>
                            c.user.user_id !== action.newCustomer.user.user_id
                    ),
                },
            };
        case "NEW_CUSTOMER_MESSAGE":
            return {
                ...state,
                activeCustomers: state.activeCustomers.map((u: any) =>
                    u.user.user_id === action.userId
                        ? { ...u, messages: [...u.messages, action.message] }
                        : u
                ),
            };
        case "REMOVE_CUSTOEMR":
            return {
                ...state,
                chat: {
                    ...state.chat,
                    customers: state.chat.customers.filter(
                        (c: any) => c.user.user_id !== action.customerId
                    ),
                },
            };
        case "CUTOMER_LEAVE":
            return {
                ...state,
                activeCustomers: state.activeCustomers.filter(
                    (c: any) => c.user.user_id !== action.userId
                ),
            };
        case "CUTOMER_LEAVE_WAITLIST":
            return {
                ...state,
                chat: {
                    ...state.chat,
                    customers: state.chat.customers.filter(
                        (c: any) => c.user.user_id !== action.userId
                    ),
                },
            };
        default:
            return state;
    }
};

const Chat = () => {
    const classes = useStyle();
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
    const user = useSelector((state: RootReducer) => state.auth.user);
    const [isReady, setReady] = useState(false);
    const [value, setValue] = useState(0);
    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    useEffect(() => {
        if (isReady) {
            socket.connect();

            socket.emit("dashboard:join", { user });

            socket.on("dashboard:error", ({ message }) => {
                dispatch({ type: "NEW_MESSAGE", message });
            });

            socket.on("dashboard:join", ({ message }) => {
                dispatch({ type: "NEW_MESSAGE", message });
            });

            socket.on("dashboard:greet", ({ message, chat }) => {
                dispatch({ type: "NEW_MESSAGE", message });

                dispatch({
                    type: "GET_CHAT",
                    chat,
                    userId: user.user_id,
                });
            });

            socket.on("dashboard:new-agent", ({ message, newUser }) => {
                dispatch({ type: "NEW_MESSAGE", message });
                dispatch({
                    type: "NEW_AGENT",
                    user_id: user.user_id,
                    newUser,
                });
            });

            socket.on("dashboard:leave", ({ message, userId }) => {
                dispatch({ type: "NEW_MESSAGE", message });
                dispatch({ type: "REMOVE_AGENT", userId });
            });

            socket.on("dashboard:send-msg", ({ message }) => {
                dispatch({ type: "NEW_MESSAGE", message });
            });

            socket.on("dashboard:new-customer", ({ message, newCustomer }) => {
                dispatch({ type: "NEW_CUSTOMER", newCustomer });
                dispatch({ type: "NEW_MESSAGE", message });
            });

            socket.on("dashboard:join-customer", ({ newCustomer }) => {
                dispatch({ type: "CONNECT_CUSTOMER", newCustomer });
            });

            socket.on("customer:msg-agent", ({ userId, message }) => {
                dispatch({ type: "NEW_CUSTOMER_MESSAGE", userId, message });
            });

            socket.on("dashboard:msg-customer", ({ userId, message }) => {
                dispatch({ type: "NEW_CUSTOMER_MESSAGE", message, userId });
            });

            socket.on(
                "dashboard:remove-customer",
                ({ customerId, message }) => {
                    dispatch({ type: "NEW_MESSAGE", message });
                    dispatch({ type: "REMOVE_CUSTOEMR", customerId });
                }
            );

            socket.on("customer:leave", ({ userId }) => {
                dispatch({ type: "CUTOMER_LEAVE", userId });
            });

            socket.on("customer:leave-waitlist", ({ userId, message }) => {
                dispatch({ type: "NEW_CUSTOMER_MESSAGE", userId, message });
                dispatch({ type: "CUTOMER_LEAVE_WAITLIST", userId });
            });

            setReady(false);
        }
    }, [isReady]);

    useEffect(() => {
        return () => {
            socket.close();
        };
    }, []);

    useEffect(() => {
        if (user) setReady(true);
    }, [user]);

    const handleSendMsg = (txt: string) => {
        socket.emit("dashboard:send-msg", { txt });
    };

    const handleDirectMsg = (
        txt: string,
        customerSokId: string,
        userId: string
    ) => {
        socket.emit("dashboard:msg-customer", { txt, customerSokId, userId });
    };

    const handleJoinUser = (socketId: string) => {
        socket.emit("dashboard:join-customer", { customerSocketId: socketId });
    };

    return (
        <>
            <HeadLayout title="Admin Chat" />
            <AdminLayout space={true}>
                <Navbar
                    customers={state.activeCustomers}
                    value={value}
                    handleChange={handleChange}
                />
                <Box className={classes.root}>
                    <Sidebar
                        handleJoinUser={handleJoinUser}
                        chat={state.chat}
                    />
                    <TabPanel value={value} index={0}>
                        <MessageList
                            user={user}
                            messages={state.messages}
                            value={value}
                        />
                        <Footer handleSendMsg={handleSendMsg} />
                    </TabPanel>
                    {state.activeCustomers.map((c, i) => (
                        <TabPanel value={value} index={i + 1}>
                            <MessageList
                                user={user}
                                messages={c.messages}
                                value={value}
                            />
                            <Footer
                                handleDirectMsg={handleDirectMsg}
                                customerSokId={c.socketId}
                                userId={c.user.user_id}
                            />
                        </TabPanel>
                    ))}
                </Box>
            </AdminLayout>
        </>
    );
};

export default Chat;

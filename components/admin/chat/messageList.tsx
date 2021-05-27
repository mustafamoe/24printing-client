import { Box, makeStyles } from "@material-ui/core";
import { IMessage } from "../../../types/chat";
import { IUser } from "../../../types/user";
import { useEffect, useRef } from "react";

// components
import MessageItem from "./messageItem";

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

interface IProps {
    messages: IMessage[];
    user: IUser;
    value: any;
}

const MessageList = ({ messages, user, value }: IProps) => {
    const classes = useStyle();
    const anchor = useRef<any>(null);

    useEffect(() => {
        if (anchor.current) {
            anchor.current.scrollIntoView();
        }
    }, [messages, value]);

    return (
        <Box className={classes.msgListRoot}>
            {messages.map((msg) => (
                <MessageItem
                    key={msg.message_id}
                    message={msg}
                    isOwner={msg.user?.user_id === user.user_id ? true : false}
                />
            ))}
            <div ref={anchor}></div>
        </Box>
    );
};

export default MessageList;

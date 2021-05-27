import { Box, Typography, makeStyles } from "@material-ui/core";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { IMessage } from "../../types/chat";
import dateFormat from "dateformat";

const useStyles = makeStyles({
    root: {
        margin: "0 0 20px 0",
        width: "100%",
    },
    avatarCon: {
        width: "40px",
        height: "40px",
        position: "relative",
        borderRadius: "50%",
        overflow: "hidden",
    },
    coverMsg: {
        margin: "0 0 20px 0",
        minWidth: "150px",
        maxWidth: "70%",
        display: "flex",
        flexDirection: "column",
        padding: "10px",
        width: "initial",
        borderRadius: "7px",
    },
    conerTime: {
        alignSelf: "flex-end",
    },
});

const Alert = (props: AlertProps) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
};

interface IProps {
    message: IMessage;
    isOwner: boolean;
}

const MessageItem = ({ message, isOwner }: IProps) => {
    const classes = useStyles();

    const Info = () => (
        <Box className={classes.root}>
            <Alert severity="info">
                {message.txt} -{" "}
                <Typography variant="caption">
                    {dateFormat(
                        message.sent_at,
                        "dddd, mmmm dS, yyyy, h:MM:ss TT"
                    )}
                </Typography>
            </Alert>
        </Box>
    );

    const Greet = () => (
        <Box className={classes.root}>
            <Alert severity="success">
                {message.txt} -{" "}
                <Typography variant="caption">
                    {dateFormat(
                        message.sent_at,
                        "dddd, mmmm dS, yyyy, h:MM:ss TT"
                    )}
                </Typography>
            </Alert>
        </Box>
    );

    const Warning = () => (
        <Box className={classes.root}>
            <Alert severity="warning">
                {message.txt} -{" "}
                <Typography variant="caption">
                    {dateFormat(
                        message.sent_at,
                        "dddd, mmmm dS, yyyy, h:MM:ss TT"
                    )}
                </Typography>
            </Alert>
        </Box>
    );

    const Conver = () => (
        <Box
            style={
                isOwner
                    ? {
                          alignSelf: "flex-end",
                      }
                    : null
            }
            boxShadow={3}
            className={classes.coverMsg}
        >
            <Box>
                <Box mb={1}>
                    <Typography variant="body1">
                        {message.user?.first_name} {message.user?.last_name}
                    </Typography>
                </Box>
            </Box>
            <Box mt={1}>
                <Typography variant="body2">{message.txt}</Typography>
            </Box>
            <Box className={classes.conerTime} mt={1}>
                <Typography variant="caption">
                    {dateFormat(message.sent_at, "UTC:h:MM:ss TT")}
                </Typography>
            </Box>
        </Box>
    );

    switch (message.type) {
        case "info":
            return <Info />;
        case "greet":
            return <Greet />;
        case "warning":
            return <Warning />;
        case "conver":
            return <Conver />;
        default:
            return null;
    }
};

export default MessageItem;

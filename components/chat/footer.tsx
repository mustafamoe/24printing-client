import { Box, IconButton, makeStyles, TextField } from "@material-ui/core";
import { useState } from "react";
import SendIcon from "@material-ui/icons/Send";

// components

const useStyles = makeStyles({
    root: {
        padding: "20px",
        width: "100%",
        position: "absolute",
        bottom: 0,
        left: 0,
        backgroundColor: "white",
        display: "flex",
        borderTop: "1px solid rgb(221, 221, 221)",
        alignItems: "center",
        maxHeight: "100px",
        minHeight: "100px",
    },
    info: {
        backgroundColor: "blue",
    },
    greet: {
        backgroundColor: "green",
    },
});

interface IProps {
    handleAddMsg: any;
}

const MessageList = ({ handleAddMsg }: IProps) => {
    const classes = useStyles();
    const [state, setState] = useState({
        message: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    const handleAdd = () => {
        handleAddMsg(state.message);
        setState({ ...state, message: "" });
    };

    const handleEnter = (e) => {
        if (e.keyCode === 13) {
            handleAdd();
        }
    };

    return (
        <Box className={classes.root}>
            <Box width="100%">
                <TextField
                    name="message"
                    label="Message"
                    size="medium"
                    value={state.message}
                    variant="outlined"
                    onChange={handleChange}
                    onKeyUp={handleEnter}
                    fullWidth
                />
            </Box>
            <Box>
                <IconButton
                    disabled={state.message ? false : true}
                    onClick={handleAdd}
                >
                    <SendIcon
                        color={state.message ? "secondary" : "disabled"}
                        fontSize="large"
                    />
                </IconButton>
            </Box>
        </Box>
    );
};

export default MessageList;

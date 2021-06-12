import {
    Box,
    IconButton,
    makeStyles,
    TextField,
    Popper,
    MenuItem,
    MenuList,
    Grow,
    Paper,
    ClickAwayListener,
} from "@material-ui/core";
import { useState, useRef, useEffect } from "react";
import SendIcon from "@material-ui/icons/Send";

// icons
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";

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
    handleSendMsg?: any;
    handleDirectMsg?: any;
    customerSokId?: string;
    userId?: string;
    closeChat?: any;
}

const Footer = ({
    handleSendMsg,
    handleDirectMsg,
    customerSokId,
    userId,
    closeChat,
}: IProps) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLButtonElement>(null);
    const prevOpen = useRef(open);
    const [state, setState] = useState({
        message: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    const handleMsg = () => {
        if (handleSendMsg) handleSendMsg(state.message);
        else if (handleDirectMsg)
            handleDirectMsg(state.message, customerSokId, userId);

        setState({ ...state, message: "" });
    };

    const handleEnter = (e) => {
        if (e.keyCode === 13) {
            handleMsg();
        }
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: React.MouseEvent<EventTarget>) => {
        if (
            anchorRef.current &&
            anchorRef.current.contains(event.target as HTMLElement)
        ) {
            return;
        }

        setOpen(false);
    };

    function handleListKeyDown(event: React.KeyboardEvent) {
        if (event.key === "Tab") {
            event.preventDefault();
            setOpen(false);
        }
    }

    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current!.focus();
        }

        prevOpen.current = open;
    }, [open]);

    // _____________________________________ handle close chat
    const handleCloseChat = (e: any) => {
        handleClose(e);
        closeChat(customerSokId, userId);
    };

    return (
        <Box className={classes.root}>
            {closeChat && (
                <Box mr={2}>
                    <Box>
                        <IconButton
                            ref={anchorRef}
                            onClick={handleToggle}
                            aria-controls={open ? "menu-list-grow" : undefined}
                            aria-haspopup="true"
                        >
                            <MoreHorizIcon />
                        </IconButton>
                    </Box>
                    <Popper
                        open={open}
                        anchorEl={anchorRef.current}
                        role={undefined}
                        transition
                        disablePortal
                        style={{ zIndex: 2 }}
                    >
                        {({ TransitionProps, placement }) => (
                            <Grow
                                {...TransitionProps}
                                style={{
                                    transformOrigin:
                                        placement === "bottom"
                                            ? "center top"
                                            : "center bottom",
                                }}
                            >
                                <Paper>
                                    <ClickAwayListener
                                        onClickAway={handleClose}
                                    >
                                        <MenuList
                                            autoFocusItem={open}
                                            id="menu-list-grow"
                                            onKeyDown={handleListKeyDown}
                                        >
                                            <MenuItem onClick={handleCloseChat}>
                                                Close chat
                                            </MenuItem>
                                        </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                            </Grow>
                        )}
                    </Popper>
                </Box>
            )}
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
                    onClick={handleMsg}
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

export default Footer;

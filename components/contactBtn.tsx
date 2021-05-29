import { Fab, makeStyles } from "@material-ui/core";

// icons
import ChatIcon from "@material-ui/icons/Chat";

const useStyles = makeStyles({
    fab: {
        zIndex: 2,
        position: "fixed",
        bottom: "20px",
        right: "20px",
    },
});

const ContactBtn = () => {
    const classes = useStyles();

    const handleOpenChat = () => {
        let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
width=500px,height=700px,left=-1000,top=-1000`;

        open("/chat", "test", params);
    };

    return (
        <Fab
            onClick={handleOpenChat}
            className={classes.fab}
            size="large"
            color="secondary"
            aria-label="chat"
        >
            <ChatIcon />
        </Fab>
    );
};

export default ContactBtn;

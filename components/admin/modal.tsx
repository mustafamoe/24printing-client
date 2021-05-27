import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { useEffect } from "react";
import { Paper } from "@material-ui/core";

// style sheet
import styles from "../../styles/admin/Modal.module.scss";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
            maxWidth: "80%",
            width: "40%",
            outline: "none",
            margin: "50px auto",
        },
    })
);

interface IProps {
    children?: React.ReactNode;
    closeInfo: {
        close: Function;
        check: boolean;
        msg?: string;
    };
    type: "parent" | "child";
    width?: number;
}

const Modal = ({ children, closeInfo, width, type }: IProps) => {
    const classes = useStyles();

    useEffect(() => {
        if (type === "parent") {
            document.body.style.overflow = "hidden";
        }

        return () => {
            if (type === "parent") {
                document.body.style.overflow = "auto";
            }
        };
    }, []);

    const handleClose = () => {
        if (closeInfo.check) {
            if (
                confirm(
                    closeInfo.msg ||
                        "Are you sure you want to close this window."
                )
            ) {
                close();
                return;
            } else return;
        }

        close();
    };

    const close = () => {
        closeInfo.close();
    };

    return (
        <div onClick={handleClose} className={styles.container}>
            <Paper
                onClick={(e) => e.stopPropagation()}
                className={`${classes.paper} ${styles.paper}`}
                style={width ? { width: `${width}%` } : null}
            >
                {children}
            </Paper>
        </div>
    );
};

export default Modal;

import {
    Box,
    Typography,
    Divider,
    Button,
    CircularProgress,
} from "@material-ui/core";
import Error from "../admin/error";

// components
import Modal from "./modal";

//icons
import DeleteIcon from "@material-ui/icons/Delete";

interface IProps {
    close: any;
    title: string;
    msg: string;
    handler: any;
    loading: boolean;
    type?: "confirmation" | "warning";
    btnTxt?: string;
    error?: string[];
    btnIcon?: React.ReactNode;
}

const ActionModal = ({
    close,
    title,
    msg,
    handler,
    loading,
    type,
    btnTxt,
    error,
    btnIcon,
}: IProps) => {
    return (
        <Modal width={50} closeInfo={{ close, check: false }} type="parent">
            <Box>
                <Box mb={3}>
                    <Typography variant="h5">{title}</Typography>
                </Box>
                <Typography variant="subtitle1">{msg}</Typography>
                {error && (
                    <Box>
                        <Error errors={error} />
                    </Box>
                )}
                <Box mb={2} mt={3}>
                    <Divider />
                </Box>
                <Box display="flex" justifyContent="flex-end">
                    <Button variant="outlined" color="primary" onClick={close}>
                        cancel
                    </Button>
                    <Box ml={2}>
                        <Button
                            variant="contained"
                            color={"primary"}
                            style={
                                type === "warning" || !type
                                    ? { backgroundColor: "red", color: "white" }
                                    : null
                            }
                            onClick={handler}
                            startIcon={
                                loading ? (
                                    <CircularProgress
                                        style={{
                                            width: "20px",
                                            height: "20px",
                                            color: "white",
                                        }}
                                    />
                                ) : btnIcon ? (
                                    btnIcon
                                ) : (
                                    <DeleteIcon
                                        style={{
                                            width: "20px",
                                            height: "20px",
                                            color: "white",
                                        }}
                                    />
                                )
                            }
                        >
                            {btnTxt || "delete"}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default ActionModal;

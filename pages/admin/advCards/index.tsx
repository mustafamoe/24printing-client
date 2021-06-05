import {
    Box,
    Typography,
    Button,
    createStyles,
    makeStyles,
    Theme,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { useState } from "react";

// components
import AdminLayout from "../../../components/admin/adminLayout";
import HeadLayout from "../../../components/headLayout";
import AdvCardList from "../../../components/admin/advCard/advCardList";
import AdvCardForm from "../../../components/admin/advCard/advCardForm";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        head: {
            backgroundColor: "white",
            padding: "10px 0",
            position: "sticky",
            zIndex: 3,
            top: 0,
        },
    })
);

const AdvCards = () => {
    const classes = useStyles();
    const [isAdd, setAdd] = useState<boolean>(false);

    const closeAdd = () => {
        setAdd(false);
    };

    const openAdd = () => {
        setAdd(true);
    };

    return (
        <>
            <HeadLayout title="Admin AdvCards" />
            <AdminLayout access="is_admin">
                <div style={{ width: "100%" }}>
                    <Box
                        className={classes.head}
                        display="flex"
                        flexDirection="column"
                    >
                        <Box display="flex" flexDirection="row">
                            <Box flexGrow={1} style={{ marginBottom: "30px" }}>
                                <Typography variant="h5">Adv cards</Typography>
                            </Box>
                            <Box>
                                <Button
                                    startIcon={<Add />}
                                    variant="contained"
                                    type="button"
                                    onClick={openAdd}
                                    color="primary"
                                >
                                    add adv card
                                </Button>
                            </Box>
                        </Box>
                        <div>
                            <AdvCardList />
                        </div>
                    </Box>
                </div>
                {isAdd && <AdvCardForm close={closeAdd} />}
            </AdminLayout>
        </>
    );
};

export default AdvCards;

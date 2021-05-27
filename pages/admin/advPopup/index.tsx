import { Box, Typography, Button } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { useState } from "react";

// components
import AdminLayout from "../../../components/admin/adminLayout";
import HeadLayout from "../../../components/headLayout";
import AdvPopupList from "../../../components/admin/advPopup/advPopupList";
import AdvPopupForm from "../../../components/admin/advPopup/advPopupForm";

const AdvPopup = () => {
    const [isAdd, setAdd] = useState<boolean>(false);

    const closeAdd = () => {
        setAdd(false);
    };

    const openAdd = () => {
        setAdd(true);
    };

    return (
        <>
            <HeadLayout title="Admin AdvPopups" />
            <AdminLayout>
                <div style={{ width: "100%" }}>
                    <Box display="flex" flexDirection="column">
                        <Box display="flex" flexDirection="row">
                            <Box flexGrow={1} style={{ marginBottom: "30px" }}>
                                <Typography variant="h5">Adv popups</Typography>
                            </Box>
                            <Box>
                                <Button
                                    startIcon={<Add />}
                                    variant="contained"
                                    type="button"
                                    onClick={openAdd}
                                    color="primary"
                                >
                                    add adv popup
                                </Button>
                            </Box>
                        </Box>
                        <div>
                            <AdvPopupList />
                        </div>
                    </Box>
                </div>
                {isAdd && <AdvPopupForm close={closeAdd} />}
            </AdminLayout>
        </>
    );
};

export default AdvPopup;

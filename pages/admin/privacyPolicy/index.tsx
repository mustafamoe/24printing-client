import { Box, Typography, Button } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { useState } from "react";

// components
import AdminLayout from "../../../components/admin/adminLayout";
import HeadLayout from "../../../components/headLayout";
import AdvPopupForm from "../../../components/admin/privacyPolicy/privacyPolicyForm";

const AdvPopup = () => {
    return (
        <>
            <HeadLayout title="Admin AdvPopups" />
            <AdminLayout access="is_admin">
                <div style={{ width: "100%" }}>
                    <Box display="flex" flexDirection="column">
                        <Box display="flex" flexDirection="row">
                            <Box flexGrow={1} style={{ marginBottom: "30px" }}>
                                <Typography variant="h5">Adv popups</Typography>
                            </Box>
                        </Box>
                        <div>
                            <AdvPopupForm />
                        </div>
                    </Box>
                </div>
            </AdminLayout>
        </>
    );
};

export default AdvPopup;

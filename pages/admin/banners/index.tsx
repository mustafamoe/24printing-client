import { Box, Typography, Button } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { useState } from "react";

// components
import AdminLayout from "../../../components/admin/adminLayout";
import HeadLayout from "../../../components/headLayout";
import BannerList from "../../../components/admin/banner/bannerList";
import BannerForm from "../../../components/admin/banner/bannerForm";

const Banners = () => {
    const [isAdd, setAdd] = useState<boolean>(false);

    const closeAdd = () => {
        setAdd(false);
    };

    const openAdd = () => {
        setAdd(true);
    };

    return (
        <>
            <HeadLayout title="Admin Banners" />
            <AdminLayout>
                <div style={{ width: "100%" }}>
                    <Box display="flex" flexDirection="column">
                        <Box display="flex" flexDirection="row">
                            <Box flexGrow={1} style={{ marginBottom: "30px" }}>
                                <Typography variant="h5">Banners</Typography>
                            </Box>
                            <Box>
                                <Button
                                    startIcon={<Add />}
                                    variant="contained"
                                    type="button"
                                    onClick={openAdd}
                                    color="primary"
                                >
                                    add banner
                                </Button>
                            </Box>
                        </Box>
                        <div>
                            <BannerList />
                        </div>
                    </Box>
                </div>
                {isAdd && <BannerForm close={closeAdd} />}
            </AdminLayout>
        </>
    );
};

export default Banners;

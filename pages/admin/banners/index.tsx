import {
    Box,
    Typography,
    Button,
    createStyles,
    makeStyles,
    Theme,
} from "@material-ui/core";
import { IBanner } from "../../../types/banner";
import { Add } from "@material-ui/icons";
import { useState } from "react";
import useSWR from "swr";

// components
import AdminLayout from "../../../components/admin/adminLayout";
import HeadLayout from "../../../components/headLayout";
import BannerList from "../../../components/admin/banner/bannerList";
import BannerForm from "../../../components/admin/banner/bannerForm";

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

const Banners = () => {
    const classes = useStyles();
    const { data: banners } = useSWR<IBanner[]>("/banners");
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
            <AdminLayout access="is_admin">
                <div style={{ width: "100%" }}>
                    <Box
                        className={classes.head}
                        display="flex"
                        flexDirection="column"
                    >
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
                            <BannerList banners={banners} />
                        </div>
                    </Box>
                </div>
                {isAdd && (
                    <BannerForm
                        bannerOrder={banners.length + 1}
                        close={closeAdd}
                    />
                )}
            </AdminLayout>
        </>
    );
};

export default Banners;

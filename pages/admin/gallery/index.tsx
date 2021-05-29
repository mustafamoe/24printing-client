import { Box, Typography, Button } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { useState } from "react";

// components
import AdminLayout from "../../../components/admin/adminLayout";
import HeadLayout from "../../../components/headLayout";
import ImageList from "../../../components/admin/gallery/imageList";
import ImageForm from "../../../components/admin/gallery/imageForm";

const Gallery = () => {
    const [isAdd, setAdd] = useState<boolean>(false);

    const closeAdd = () => {
        setAdd(false);
    };

    const openAdd = () => {
        setAdd(true);
    };

    return (
        <>
            <HeadLayout title="Admin Gallery" />
            <AdminLayout access="is_admin">
                <div style={{ width: "100%" }}>
                    <Box display="flex" flexDirection="column">
                        <Box display="flex" flexDirection="row">
                            <Box flexGrow={1} style={{ marginBottom: "30px" }}>
                                <Typography variant="h5">Gallery</Typography>
                            </Box>
                            <Box>
                                <Button
                                    startIcon={<Add />}
                                    variant="contained"
                                    type="button"
                                    onClick={openAdd}
                                    color="primary"
                                >
                                    add images
                                </Button>
                            </Box>
                        </Box>
                        <div>
                            <ImageList />
                        </div>
                    </Box>
                </div>
                {isAdd && <ImageForm close={closeAdd} />}
            </AdminLayout>
        </>
    );
};

export default Gallery;

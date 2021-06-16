import { Box, Typography, makeStyles } from "@material-ui/core";

// components
import HeadLayout from "../../components/headLayout";
import AdminLayout from "../../components/admin/adminLayout";
import ImageOpt from "../../components/imageOpt";

const useStyles = makeStyles({
    root: {
        display: "flex",
        height: "calc(100vh - 100px)",
        justifyContent: "center",
        width: "100%",
    },
    greet: {
        textAlign: "center",
        marginTop: "30px",
    },
});

const Admin = () => {
    const classes = useStyles();

    return (
        <>
            <HeadLayout title="Admin Sub Category" />
            <AdminLayout access="all">
                <div style={{ width: "100%" }}>
                    <Box display="flex" flexDirection="column">
                        <Box
                            className={classes.root}
                            display="flex"
                            flexDirection="row"
                        >
                            <Box m="auto">
                                <ImageOpt
                                    location="local"
                                    src="/24printinglogo.png"
                                    width={400}
                                    height={120}
                                />
                                <Typography
                                    variant="h5"
                                    className={classes.greet}
                                >
                                    Welcome to 24printing dashboard
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </div>
            </AdminLayout>
        </>
    );
};

export default Admin;

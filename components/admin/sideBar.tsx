import {
    List,
    ListItemText,
    ListItem,
    Drawer,
    ListItemIcon,
    Divider,
    Box,
} from "@material-ui/core";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { signoutCall } from "../../store/actions/user";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";

// data
import { tabsList } from "../../data/adminSideBar";
import { RootReducer } from "../../store/reducers";

const drawerWidth = 240;

const useStyles = makeStyles(() =>
    createStyles({
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
    })
);

const SideBar = () => {
    const router = useRouter();
    const [acitve, setActive] = useState<string | null>(null);
    const dispatch = useDispatch();
    const user = useSelector((state: RootReducer) => state.auth.user);
    const classes = useStyles();

    const handleActive = (link) => {
        setActive(link);
        router.push(link);
    };

    useEffect(() => {
        const pathname = router.pathname.split("/");
        setActive(`/${pathname[1]}/${pathname[2]}`);
    }, []);

    const handleSignout = () => {
        dispatch(signoutCall());
    };

    return (
        <div>
            <Drawer
                className={classes.drawer}
                classes={{
                    paper: classes.drawerPaper,
                }}
                variant="permanent"
            >
                <ListItem onClick={() => router.push("/")} button>
                    <ListItemIcon>
                        <Image src="/home.png" width={30} height={30} />
                    </ListItemIcon>
                    <ListItemText>24printing</ListItemText>
                </ListItem>
                <Divider />
                <List component="nav">
                    {tabsList.map((tab, i) =>
                        tab.divider ? (
                            <Box mb={1} mt={1} key={i}>
                                <Divider />
                            </Box>
                        ) : (
                            <>
                                {[
                                    user.is_super_admin && "is_super_admin",
                                    user.is_admin && "is_admin",
                                    user.is_accountant && "is_accountant",
                                    user.is_customer_service &&
                                        "is_customer_service",
                                ].includes(tab.access) ? (
                                    <ListItem
                                        selected={acitve === tab.link}
                                        onClick={() => handleActive(tab.link)}
                                        key={i}
                                        button
                                    >
                                        <ListItemIcon>
                                            <Image
                                                src={tab.icon}
                                                width={30}
                                                height={30}
                                            />
                                        </ListItemIcon>
                                        <ListItemText>{tab.text}</ListItemText>
                                    </ListItem>
                                ) : null}
                            </>
                        )
                    )}
                    <Box mb={1} mt={1}>
                        <Divider />
                    </Box>
                    <ListItem onClick={handleSignout} button>
                        <ListItemIcon>
                            <Image src="/signout.png" width={30} height={30} />
                        </ListItemIcon>
                        <ListItemText>Signout</ListItemText>
                    </ListItem>
                </List>
            </Drawer>
        </div>
    );
};

export default SideBar;

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
import { RootReducer } from "../../store/reducers";
import { Access } from "../../types/user";

// data
import { tabsList } from "../../data/adminSideBar";

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

    const getAccess = (access: Access) => {
        switch (access) {
            case "is_admin":
                if (user.is_super_admin || user.is_admin) return true;
                return false;
            case "is_customer_service":
                if (
                    user.is_super_admin ||
                    user.is_admin ||
                    user.is_customer_service
                )
                    return true;

                return false;
            case "is_accountant":
                if (user.is_super_admin || user.is_admin || user.is_accountant)
                    return true;

                return false;
            default:
                return false;
        }
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
                    {tabsList.map((tab, i) => (
                        <>
                            {getAccess(tab.access) && (
                                <>
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
                                    {tab.divider && (
                                        <Box mb={1} mt={1} key={i}>
                                            <Divider />
                                        </Box>
                                    )}
                                </>
                            )}
                        </>
                    ))}
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

import { Box, Typography, makeStyles, Tabs, Tab } from "@material-ui/core";
import { IChat } from "../../../types/chat";
import { useState } from "react";
import ImageOpt from "../../imageOpt";

// components

const useStyles = makeStyles({
    root: {
        height: "100%",
        maxHeight: "100%",
        width: "350px",
        minWidth: "350px",
        padding: "10px",
        borderRight: "1px solid rgb(221, 221, 221)",
        overflowY: "auto",
    },
    avatarCon: {
        width: "40px",
        height: "40px",
        position: "relative",
        borderRadius: "50%",
        overflow: "hidden",
    },
    userCard: {
        padding: "10px 20px",
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid rgb(221, 221, 221)",
    },
    userWaitCard: {
        padding: "10px 20px",
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid rgb(221, 221, 221)",
        cursor: "pointer",
        "&:hover": {
            backgroundColor: "rgb(240, 240, 240)",
        },
        transition: "all .1s ease",
    },
    emptyImgCon: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        marginTop: "50px",
    },
    emptyMsg: {
        // marginTop: "20px",
    },
});

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box>{children}</Box>}
        </div>
    );
};

interface IProps {
    chat: IChat;
    handleJoinUser: any;
}

const MessageList = ({ chat, handleJoinUser }: IProps) => {
    const classes = useStyles();
    const [value, setValue] = useState(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box className={classes.root}>
            <Tabs
                value={value}
                indicatorColor="primary"
                textColor="primary"
                onChange={handleChange}
                aria-label="disabled tabs example"
            >
                <Tab label="Wait list" />
                <Tab label="agents" />
            </Tabs>
            <Box>
                <TabPanel value={value ? 0 : 1} index={0}>
                    <Box>
                        {!chat.agents.length ? (
                            <Box className={classes.emptyImgCon}>
                                <ImageOpt
                                    src="/agent.png"
                                    location="local"
                                    width={200}
                                    height={200}
                                />
                                <Typography className={classes.emptyMsg}>
                                    No online agents.
                                </Typography>
                            </Box>
                        ) : (
                            <Box>
                                {chat.agents.map((u) => (
                                    <Box
                                        className={classes.userCard}
                                        key={u.user.user_id}
                                    >
                                        <Box className={classes.avatarCon}>
                                            <ImageOpt
                                                src={u.user.avatar?.image_name}
                                                layout="fill"
                                                objectFit="contain"
                                            />
                                        </Box>
                                        <Box ml={2}>
                                            <Typography>
                                                {u.user.first_name}{" "}
                                                {u.user.last_name}
                                            </Typography>
                                            <Typography>
                                                {u.user.email}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Box>
                </TabPanel>
                <TabPanel value={value ? 0 : 1} index={1}>
                    <Box>
                        {!chat.customers.length ? (
                            <Box className={classes.emptyImgCon}>
                                <ImageOpt
                                    src="/waitlist.png"
                                    location="local"
                                    width={200}
                                    height={200}
                                />
                                <Typography className={classes.emptyMsg}>
                                    No customers.
                                </Typography>
                            </Box>
                        ) : (
                            <Box>
                                {chat.customers.map((u) => (
                                    <Box
                                        onClick={() =>
                                            handleJoinUser(u.socketId)
                                        }
                                        className={classes.userWaitCard}
                                        key={u.user.user_id}
                                    >
                                        <Box className={classes.avatarCon}>
                                            <ImageOpt
                                                src={u.user.avatar?.image_name}
                                                layout="fill"
                                                objectFit="contain"
                                            />
                                        </Box>
                                        <Box ml={2}>
                                            <Typography>
                                                {u.user.first_name}{" "}
                                                {u.user.last_name}
                                            </Typography>
                                            <Typography>
                                                {(u.user as any)?.fullName}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Box>
                </TabPanel>
            </Box>
        </Box>
    );
};

export default MessageList;

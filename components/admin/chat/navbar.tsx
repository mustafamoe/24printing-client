import { makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { Customer } from "../../../types/customer";
import { IMessage } from "../../../types/chat";

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
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
};

const a11yProps = (index: any) => {
    return {
        id: `scrollable-auto-tab-${index}`,
        "aria-controls": `scrollable-auto-tabpanel-${index}`,
    };
};

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,
        width: "100%",
        backgroundColor: theme.palette.background.paper,
        height: "50px",
        maxHeight: "50px",
    },
    indicator: {
        backgroundColor: "white",
    },
    tab: {
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        width: "150px",
        maxWidth: "150px",
        display: "inline-block",
    },
}));

interface IProps {
    value: number;
    handleChange: any;
    customers: { user: Customer; messages: IMessage[] }[];
}

const Navbar = ({ value, handleChange, customers }: IProps) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar position="static" color="primary">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    classes={{ indicator: classes.indicator }}
                    style={{ color: "white" }}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab
                        classes={{ root: classes.tab }}
                        label={<span className={classes.tab}>agents room</span>}
                        {...a11yProps(0)}
                    />
                    {customers.map((c: any, i) => (
                        <Tab
                            key={c.user.user_id}
                            classes={{ root: classes.tab }}
                            label={
                                <span className={classes.tab}>
                                    {c.type === "auth"
                                        ? `${c.user.first_name} ${c.user.last_name}`
                                        : c.user.fullName}
                                </span>
                            }
                            {...a11yProps(i + 1)}
                        />
                    ))}
                </Tabs>
            </AppBar>
        </div>
    );
};

export default Navbar;

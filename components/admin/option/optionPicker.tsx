import {
    Divider,
    Typography,
    Box,
    CircularProgress,
    Checkbox,
    Button,
    FormControlLabel,
    Tabs,
    Tab,
} from "@material-ui/core";
import { useState, useEffect } from "react";
import useSwr from "swr";
import { IOption } from "../../../types/option";

// style sheet
import styles from "../../../styles/admin/option/OptionPicker.module.scss";

// components
import Modal from "../modal";
import OptionForm from "./optionForm";
import { ICustomization } from "../../../types/customization";

const a11yProps = (index: any) => {
    return {
        id: `full-width-tab-${index}`,
        "aria-controls": `full-width-tabpanel-${index}`,
    };
};

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
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
};

interface IProps {
    close: Function;
    state: any;
    setState: any;
}

const OptionPicker = ({ close, state, setState }: IProps) => {
    const [isImage, setImage] = useState(false);
    const [options, setOptions] = useState<IOption[]>([]);
    const [active, setActive] = useState(0);
    const [loading, setLoading] = useState(true);
    const { data, error } = useSwr<IOption[]>("/options");

    useEffect(() => {
        if (data || error) setLoading(false);
    }, [data, error]);

    useEffect(() => {
        setOptions(state.customizations.map((c) => c.option));
    }, []);

    const handleSelect = (optionId: string) => {
        const foundOption = data.find((o) => o.option_id === optionId);

        if (options.includes(foundOption)) {
            setOptions(options.filter((o) => o.option_id !== optionId));
            return;
        }

        if (foundOption) setOptions([...options, foundOption]);
    };

    const handleSave = () => {
        const tmpCustomizations: ICustomization[] = [];

        for (let opt of options) {
            const foundCustomization: ICustomization =
                state.customizations.find(
                    (c) => c.option.option_id === opt.option_id
                );

            if (!foundCustomization) {
                tmpCustomizations.push({
                    customization_id: String(Date.now()),
                    option: opt,
                    type: "card",
                    cards: [],
                    dropdown: [],
                });

                continue;
            }

            tmpCustomizations.push(foundCustomization);
        }

        setState({ ...state, customizations: tmpCustomizations });

        close();
    };

    const closeOptionForm = () => {
        setImage(false);
    };

    const openOptionForm = () => {
        setImage(true);
    };

    const handleChange = (e: React.ChangeEvent<{}>, newValue: number) => {
        setActive(newValue);
    };

    const getSelectedOptions = () => {
        return data.filter((option) => options.includes(option));
    };

    return (
        <>
            <Modal
                type="child"
                closeInfo={{
                    close,
                    check: true,
                }}
                width={70}
            >
                <Box>
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={3}
                    >
                        <Typography variant="h6">
                            Please pick at least one option.
                        </Typography>
                        <Box display="flex">
                            <Box mr={2}>
                                <Button
                                    onClick={handleSave}
                                    variant="contained"
                                    style={{
                                        backgroundColor: "#ec008c",
                                        color: "white",
                                    }}
                                >
                                    save changes
                                </Button>
                            </Box>
                            <Button
                                style={{
                                    backgroundColor: "#00529b",
                                    color: "white",
                                }}
                                onClick={openOptionForm}
                                variant="contained"
                            >
                                add option
                            </Button>
                        </Box>
                    </Box>
                    <Tabs
                        value={active}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                    >
                        <Tab label="All options" {...a11yProps(0)} />
                        <Tab label="Selected options" {...a11yProps(1)} />
                    </Tabs>
                    <Divider />
                    {loading ? (
                        <Box display="flex" mt={2} justifyContent="center">
                            <CircularProgress color="secondary" />
                        </Box>
                    ) : (
                        <>
                            <TabPanel value={active} index={0}>
                                <div
                                    style={{ marginTop: "20px" }}
                                    className={styles.optionsWrapper}
                                >
                                    {data.map((option) => (
                                        <FormControlLabel
                                            key={option.option_id}
                                            control={
                                                <Checkbox
                                                    key={option.option_id}
                                                    checked={options.includes(
                                                        option
                                                    )}
                                                    onChange={() =>
                                                        handleSelect(
                                                            option.option_id
                                                        )
                                                    }
                                                />
                                            }
                                            label={option.option_name}
                                        />
                                    ))}
                                </div>
                            </TabPanel>
                            <TabPanel value={active} index={1}>
                                <div
                                    style={{ marginTop: "20px" }}
                                    className={styles.optionsWrapper}
                                >
                                    {getSelectedOptions().map((option) => (
                                        <FormControlLabel
                                            key={option.option_id}
                                            control={
                                                <Checkbox
                                                    key={option.option_id}
                                                    checked={options.includes(
                                                        option
                                                    )}
                                                    onChange={() =>
                                                        handleSelect(
                                                            option.option_id
                                                        )
                                                    }
                                                />
                                            }
                                            label={option.option_name}
                                        />
                                    ))}
                                </div>
                            </TabPanel>
                        </>
                    )}
                </Box>
            </Modal>
            {isImage && <OptionForm close={closeOptionForm} />}
        </>
    );
};

export default OptionPicker;

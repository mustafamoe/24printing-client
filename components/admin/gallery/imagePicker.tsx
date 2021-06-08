import {
    Divider,
    Typography,
    Box,
    CircularProgress,
    Checkbox,
    Button,
    Tabs,
    Tab,
    createStyles,
    makeStyles,
    Menu,
    MenuItem,
    Theme,
} from "@material-ui/core";
import { useState, useEffect } from "react";
import useSWR from "swr";
import ImageOpt from "../../imageOpt";

// style sheet
import styles from "../../../styles/admin/gallery/ImagePicker.module.scss";

// components
import Modal from "../modal";
import ImageForm from "./imageForm";

// icons
import SortIcon from "@material-ui/icons/Sort";

type Sort = "Latest" | "Oldest";

const sortOptions: Sort[] = ["Latest", "Oldest"];

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

function a11yProps(index: any) {
    return {
        id: `full-width-tab-${index}`,
        "aria-controls": `full-width-tabpanel-${index}`,
    };
}

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
    type: "single" | "multiple";
    fieldName: string;
    state: any;
    setState: any;
}

const ImagePicker = ({ close, state, setState, type, fieldName }: IProps) => {
    const classes = useStyles();
    const [isImage, setImage] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [active, setActive] = useState(0);
    const [loading, setLoading] = useState(true);
    const { data, error } = useSWR("/images");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedSort, setSelectedSort] = useState<Sort | null>("Latest");

    useEffect(() => {
        if (type === "single") {
            setImages([...images, state[fieldName]]);
        } else if (type === "multiple") {
            setImages([...images, ...state[fieldName]]);
        }
    }, []);

    useEffect(() => {
        if (data || error) setLoading(false);
    }, [data, error]);

    const handleSelect = (imageId: string) => {
        if (type === "single") {
            if (images.includes(imageId)) {
                setImages([]);
            } else {
                setImages([imageId]);
            }
        } else if (type === "multiple") {
            if (images.includes(imageId)) {
                setImages([...images].filter((id) => id !== imageId));
            } else {
                setImages([...images, imageId]);
            }
        }
    };

    const handleSave = () => {
        if (type === "single") {
            setState({ ...state, [fieldName]: images[0] || "" });
        } else if (type === "multiple") {
            setState({ ...state, [fieldName]: images });
        }

        close();
    };

    const closeImageForm = () => {
        setImage(false);
    };

    const openImageForm = () => {
        setImage(true);
    };

    const handleChange = (e: React.ChangeEvent<{}>, newValue: number) => {
        setActive(newValue);
    };

    const getSelectedImages = () => {
        return data.filter((img) => images.includes(img.image_id));
    };

    const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (
        event: React.MouseEvent<HTMLElement>,
        value: Sort
    ) => {
        setSelectedSort(value);
        setAnchorEl(null);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSort = (a: any, b: any) => {
        if (selectedSort === "Latest") {
            return (
                new Date(b.created_at).valueOf() -
                new Date(a.created_at).valueOf()
            );
        } else if (selectedSort === "Oldest") {
            return (
                new Date(a.created_at).valueOf() -
                new Date(b.created_at).valueOf()
            );
        }
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
                <Box position="relative">
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        className={classes.head}
                        mb={3}
                    >
                        <Typography variant="h6">
                            Please pick at least one image.
                        </Typography>
                        <Box display="flex">
                            <div>
                                <Box mr={2}>
                                    <Button
                                        startIcon={<SortIcon />}
                                        variant="outlined"
                                        onClick={handleClickListItem}
                                    >
                                        Sort
                                    </Button>
                                </Box>
                                <Menu
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "center",
                                    }}
                                    transformOrigin={{
                                        vertical: "bottom",
                                        horizontal: "center",
                                    }}
                                    onClose={handleClose}
                                >
                                    {sortOptions.map((sort) => (
                                        <MenuItem
                                            key={sort}
                                            selected={sort === selectedSort}
                                            onClick={(event) =>
                                                handleMenuItemClick(event, sort)
                                            }
                                        >
                                            {sort}
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </div>
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
                                onClick={openImageForm}
                                variant="contained"
                            >
                                add image
                            </Button>
                        </Box>
                    </Box>
                    <Tabs
                        value={active}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        aria-label="full width tabs example"
                    >
                        <Tab label="All images" {...a11yProps(0)} />
                        <Tab label="Selected images" {...a11yProps(1)} />
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
                                    className={styles.imagesWrapper}
                                >
                                    {data
                                        .sort((a, b) => handleSort(a, b))
                                        .map((img) => (
                                            <div
                                                className={
                                                    styles.imageContainer
                                                }
                                                style={{
                                                    position: "relative",
                                                    height: "200px",
                                                }}
                                            >
                                                <div
                                                    className={
                                                        styles.checkboxContainer
                                                    }
                                                >
                                                    <Checkbox
                                                        checked={images.includes(
                                                            img.image_id
                                                        )}
                                                        onChange={() =>
                                                            handleSelect(
                                                                img.image_id
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <ImageOpt
                                                    src={img.image_name}
                                                    alt={img.image_name}
                                                    layout="fill"
                                                    objectFit="contain"
                                                />
                                            </div>
                                        ))}
                                </div>
                            </TabPanel>
                            <TabPanel value={active} index={1}>
                                <div
                                    style={{ marginTop: "20px" }}
                                    className={styles.imagesWrapper}
                                >
                                    {getSelectedImages().map((img) => (
                                        <div
                                            className={styles.imageContainer}
                                            style={{
                                                position: "relative",
                                                height: "200px",
                                            }}
                                        >
                                            <div
                                                className={
                                                    styles.checkboxContainer
                                                }
                                            >
                                                <Checkbox
                                                    checked={images.includes(
                                                        img.image_id
                                                    )}
                                                    onChange={() =>
                                                        handleSelect(
                                                            img.image_id
                                                        )
                                                    }
                                                />
                                            </div>
                                            <ImageOpt
                                                src={img.image_name}
                                                alt={img.image_name}
                                                layout="fill"
                                                objectFit="contain"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </TabPanel>
                        </>
                    )}
                </Box>
            </Modal>
            {isImage && <ImageForm close={closeImageForm} />}
        </>
    );
};

export default ImagePicker;

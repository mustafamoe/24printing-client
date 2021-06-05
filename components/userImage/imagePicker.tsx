import {
    Divider,
    Typography,
    Box,
    CircularProgress,
    Checkbox,
    Button,
    Tabs,
    Tab,
} from "@material-ui/core";
import { useState, useEffect } from "react";
import useSWR from "swr";
import ImageOpt from "../imageOpt";

// style sheet
import styles from "../../styles/admin/gallery/ImagePicker.module.scss";

// components
import Modal from "../admin/modal";
import ImageForm from "./imageForm";
import { useSelector } from "react-redux";
import { RootReducer } from "../../store/reducers";

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

function TabPanel(props: TabPanelProps) {
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
}

interface IProps {
    close: Function;
    type: "single" | "multiple";
    fieldName: string;
    state: any;
    setState: any;
}

const ImagePicker = ({ close, state, setState, type, fieldName }: IProps) => {
    const { user_id } = useSelector((state: RootReducer) => state.auth.user);
    const [isImage, setImage] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [active, setActive] = useState(0);
    const [loading, setLoading] = useState(true);
    const { data, error } = useSWR(`/user_images?authId=${user_id}`);

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

    if (data)
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
                                Please pick at least one image.
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
                                        {data.map((img) => (
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
                            </>
                        )}
                    </Box>
                </Modal>
                {isImage && <ImageForm close={closeImageForm} />}
            </>
        );

    return null;
};

export default ImagePicker;

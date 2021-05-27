import { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import {
    Grid,
    FormControlLabel,
    FormGroup,
    FormControl,
    FormLabel,
    RadioGroup,
    Radio,
    Button,
    Box,
    CircularProgress,
    Divider,
} from "@material-ui/core";
import TextEditor from "../textEditor";
import { apiCall } from "../../../utils/apiCall";
import { mutate } from "swr";
import { RootReducer } from "../../../store/reducers";
import { useSelector } from "react-redux";
import { bannerPages } from "../../../types/banner";

// components
import Modal from "../modal";
import Error from "../error";
import ImagePicker from "../gallery/imagePicker";
import { IBanner } from "../../../types/banner";

interface IProps {
    close: Function;
    banner?: IBanner;
}

interface IState {
    image: string;
    title: string;
    content: string;
    link: string;
    banner_page: string;
}

interface IError {
    image: string[];
    banner_page: string[];
}

const BannerForm = ({ close, banner }: IProps) => {
    const [isImage, setImage] = useState<boolean>(false);
    const [isShowcase, setShowcase] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const user = useSelector((state: RootReducer) => state.auth.user);
    const [state, setState] = useState<IState>({
        image: "",
        title: "",
        content: "",
        link: "",
        banner_page: "",
    });
    const [errors, setErrors] = useState<IError>({
        image: [],
        banner_page: [],
    });

    useEffect(() => {
        if (banner) {
            setState({
                ...state,
                image: banner.image?.image_id || "",
                title: banner.title || "",
                content: banner.content || "",
                link: banner.link || "",
                banner_page: banner.banner_page || "",
            });
        }
    }, []);

    const handleOpenMedia = (type: "image" | "showcase") => {
        if (type === "image") setImage(true);
        else if (type === "showcase") setShowcase(true);
    };

    const handleCloseMedia = (type: "image" | "showcase") => {
        if (type === "image") setImage(false);
        else if (type === "showcase") setShowcase(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    const handleEditorChange = (e: any, name: string): void => {
        setState({ ...state, [name]: e });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!loading) {
            const errors = handleValidate();

            for (let e of Object.values(errors)) {
                if (e.length) return;
            }

            try {
                if (!banner) {
                    setLoading(true);
                    const banner = await apiCall(
                        "post",
                        `/banner?authId=${user.user_id}`,
                        state
                    );

                    mutate(
                        "/banners",
                        (banners) => {
                            return [...banners, banner];
                        },
                        false
                    );
                } else {
                    setLoading(true);
                    const editedBanner = await apiCall(
                        "put",
                        `/banner/${banner.banner_id}?authId=${user.user_id}`,
                        state
                    );

                    mutate(
                        "/banners",
                        (banners) => {
                            return banners.map((p) =>
                                p.banner_id !== banner.banner_id
                                    ? p
                                    : editedBanner
                            );
                        },
                        false
                    );
                }

                close();
            } catch (err) {
                setLoading(false);
                setErrors({ ...errors, ...err });
            }
        }
    };

    const handleValidate = () => {
        const TmpErrors: IError = {
            image: [],
            banner_page: [],
        };

        if (!state.image) {
            TmpErrors.image.push("Please choose an image.");
        }

        if (!state.banner_page || !bannerPages.includes(state.banner_page)) {
            TmpErrors.banner_page.push("Please choose banner page.");
        }

        setErrors({ ...errors, ...TmpErrors });

        return TmpErrors;
    };

    return (
        <>
            <Modal
                type="parent"
                width={70}
                closeInfo={{
                    close,
                    check: true,
                }}
            >
                <form onSubmit={handleSubmit} noValidate autoComplete="off">
                    <div>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">
                                Banner page
                            </FormLabel>
                            <RadioGroup
                                name="banner_page"
                                value={state.banner_page}
                                onChange={handleChange}
                            >
                                <FormControlLabel
                                    value="home"
                                    control={<Radio />}
                                    label="Home"
                                />
                                <FormControlLabel
                                    value="shop"
                                    control={<Radio />}
                                    label="Shop"
                                />
                            </RadioGroup>
                            <Error errors={errors.banner_page} />
                        </FormControl>
                        <Box mb={3} mt={3}>
                            <Divider />
                        </Box>
                        <Grid
                            style={{ marginBottom: "5px" }}
                            container
                            spacing={10}
                        >
                            <Grid item xs={6}>
                                <FormGroup>
                                    <FormLabel
                                        required={true}
                                        style={{ marginBottom: "10px" }}
                                        htmlFor="image"
                                    >
                                        Banner image
                                    </FormLabel>
                                    <Button
                                        variant="contained"
                                        onClick={() => handleOpenMedia("image")}
                                        color="primary"
                                    >
                                        open gallery
                                    </Button>
                                </FormGroup>
                                <Error errors={errors.image} />
                            </Grid>
                        </Grid>
                        <Box mb={3} mt={3}>
                            <Divider />
                        </Box>
                        <Box mb={3}>
                            <TextField
                                name="title"
                                label="Title"
                                size="small"
                                value={state.title}
                                variant="outlined"
                                onChange={handleChange}
                                style={{ width: "100%" }}
                            />
                        </Box>
                        <Box mb={3} mt={3}>
                            <Divider />
                        </Box>
                        <Box mb={3}>
                            <TextField
                                name="link"
                                label="Link"
                                size="small"
                                value={state.link}
                                variant="outlined"
                                onChange={handleChange}
                                style={{ width: "100%" }}
                            />
                        </Box>
                        <Box mb={3} mt={3}>
                            <Divider />
                        </Box>
                        <FormGroup style={{ margin: "30px 0" }}>
                            <FormLabel
                                style={{ marginBottom: "10px" }}
                                required={true}
                                htmlFor="about"
                            >
                                Content
                            </FormLabel>
                            <TextEditor
                                id="about"
                                name="content"
                                value={state.content}
                                onChange={handleEditorChange}
                            />
                        </FormGroup>
                        <Box
                            display="flex"
                            flexDirection="column"
                            style={{ marginTop: "20px" }}
                        >
                            <Button
                                color="secondary"
                                type="submit"
                                variant="contained"
                            >
                                {loading ? (
                                    <CircularProgress
                                        style={{ color: "white" }}
                                    />
                                ) : (
                                    "Submit"
                                )}
                            </Button>
                        </Box>
                    </div>
                </form>
            </Modal>
            {isImage && (
                <ImagePicker
                    state={state}
                    setState={setState}
                    fieldName="image"
                    close={() => handleCloseMedia("image")}
                    type="single"
                />
            )}
            {isShowcase && (
                <ImagePicker
                    state={state}
                    setState={setState}
                    fieldName="showcase"
                    close={() => handleCloseMedia("showcase")}
                    type="multiple"
                />
            )}
        </>
    );
};

export default BannerForm;

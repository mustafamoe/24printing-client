import { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import {
    Grid,
    FormGroup,
    FormLabel,
    FormControl,
    Switch,
    Button,
    FormControlLabel,
    Box,
    CircularProgress,
    Divider,
    Typography,
} from "@material-ui/core";
import { apiCall } from "../../../utils/apiCall";
import { mutate } from "swr";
import { RootReducer } from "../../../store/reducers";
import { useSelector } from "react-redux";

// components
import Modal from "../modal";
import Error from "../error";
import ImagePicker from "../gallery/imagePicker";
import { IAdvPopup } from "../../../types/advPopup";

interface IProps {
    close: Function;
    advPopup?: IAdvPopup;
}

interface IState {
    image: string;
    is_active: boolean;
    link: string;
}

interface IError {
    image: string[];
}

const AdvPopupForm = ({ close, advPopup }: IProps) => {
    const [isImage, setImage] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const user = useSelector((state: RootReducer) => state.auth.user);
    const [state, setState] = useState<IState>({
        image: "",
        is_active: false,
        link: "",
    });
    const [errors, setErrors] = useState<IError>({
        image: [],
    });

    useEffect(() => {
        if (advPopup) {
            console.log(advPopup.is_active);
            setState({
                ...state,
                image: advPopup.image?.image_id || "",
                is_active: advPopup.is_active,
                link: advPopup.link || "",
            });
        }
    }, []);

    const handleOpenMedia = (type: "image") => {
        if (type === "image") setImage(true);
    };

    const handleCloseMedia = (type: "image") => {
        if (type === "image") setImage(false);
    };

    const handleSwitch = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!loading) {
            const errors = handleValidate();

            for (let e of Object.values(errors)) {
                if (e.length) return;
            }

            try {
                if (!advPopup) {
                    setLoading(true);
                    const advPopup = await apiCall(
                        "post",
                        `/adv_popup?authId=${user.user_id}`,
                        state
                    );

                    mutate(
                        "/adv_popups",
                        (advPopups) => {
                            return [...advPopups, advPopup];
                        },
                        false
                    );
                } else {
                    setLoading(true);
                    const editedAdvPopup = await apiCall<IAdvPopup>(
                        "put",
                        `/adv_popup/${advPopup.adv_popup_id}?authId=${user.user_id}`,
                        state
                    );

                    mutate(
                        "/adv_popups",
                        (advPopups: IAdvPopup[]) => {
                            return advPopups.map((ap) => {
                                if (
                                    ap.adv_popup_id !==
                                    editedAdvPopup.adv_popup_id
                                ) {
                                    if (state.is_active) {
                                        return { ...ap, is_active: false };
                                    }

                                    return ap;
                                }

                                return editedAdvPopup;
                            });
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
        };

        if (!state.image) {
            TmpErrors.image.push("Please choose an image.");
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
                        <Box mb={5}>
                            <Typography variant="h5">Adv popup form</Typography>
                        </Box>
                        <Box>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">
                                    Adv popup settings
                                </FormLabel>
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={state.is_active}
                                                onChange={handleSwitch}
                                                name="is_active"
                                            />
                                        }
                                        label="Active"
                                    />
                                </FormGroup>
                            </FormControl>
                        </Box>
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
                                        AdvPopup image
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
                                name="link"
                                label="Link"
                                size="small"
                                value={state.link}
                                variant="outlined"
                                onChange={handleChange}
                                style={{ width: "100%" }}
                            />
                        </Box>
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
        </>
    );
};

export default AdvPopupForm;

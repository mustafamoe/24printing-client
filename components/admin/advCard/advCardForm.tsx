import { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import {
    Grid,
    FormGroup,
    FormLabel,
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

// components
import Modal from "../modal";
import Error from "../error";
import ImagePicker from "../gallery/imagePicker";
import { IAdvCard } from "../../../types/advCard";

interface IProps {
    close: Function;
    advCard?: IAdvCard;
}

interface IState {
    image: string;
    title: string;
    content: string;
    link: string;
}

interface IError {
    image: string[];
}

const AdvCardForm = ({ close, advCard }: IProps) => {
    const [isImage, setImage] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const user = useSelector((state: RootReducer) => state.auth.user);
    const [state, setState] = useState<IState>({
        image: "",
        title: "",
        content: "",
        link: "",
    });
    const [errors, setErrors] = useState<IError>({
        image: [],
    });

    useEffect(() => {
        if (advCard) {
            setState({
                ...state,
                image: advCard.image?.image_id || "",
                title: advCard.title || "",
                content: advCard.content || "",
                link: advCard.link || "",
            });
        }
    }, []);

    const handleOpenMedia = (type: "image") => {
        if (type === "image") setImage(true);
    };

    const handleCloseMedia = (type: "image") => {
        if (type === "image") setImage(false);
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
                if (!advCard) {
                    setLoading(true);
                    const advCard = await apiCall(
                        "post",
                        `/adv_card?authId=${user.user_id}`,
                        state
                    );

                    mutate(
                        "/adv_cards",
                        (advCards) => {
                            return [...advCards, advCard];
                        },
                        false
                    );
                } else {
                    setLoading(true);
                    const editedAdvCard = await apiCall(
                        "put",
                        `/adv_card/${advCard.adv_card_id}?authId=${user.user_id}`,
                        state
                    );

                    mutate(
                        "/adv_cards",
                        (advCards) => {
                            return advCards.map((ac) =>
                                ac.adv_card_id !== advCard.adv_card_id
                                    ? ac
                                    : editedAdvCard
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
                                        AdvCard image
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
                                htmlFor="content"
                            >
                                Content
                            </FormLabel>
                            <TextEditor
                                id="content"
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
        </>
    );
};

export default AdvCardForm;

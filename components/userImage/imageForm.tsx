import { Box, Grid, Typography, CircularProgress } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import { useState } from "react";
import { apiCall } from "../../utils/apiCall";
import { mutate } from "swr";
import { useSelector } from "react-redux";

// style sheet
import styles from "../../styles/admin/gallery/ImageForm.module.scss";

// components
import Modal from "../admin/modal";
import Error from "../admin/error";
import { RootReducer } from "../../store/reducers";
import { IImage } from "../../types/image";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            "& > *": {
                margin: theme.spacing(1),
            },
        },
        input: {
            display: "none",
        },
    })
);

interface IError {
    image: string[];
}

interface IProps {
    close: Function;
    image?: IImage;
}

const ImageForm = ({ close }: IProps) => {
    const classes = useStyles();
    const [loading, setLoading] = useState<boolean>(false);
    const user = useSelector((state: RootReducer) => state.auth.user);
    const [errors, setErrors] = useState<IError>({
        image: [],
    });
    const [state, setState] = useState({
        images: [],
    });

    const handleChange = async (e) => {
        if (e.target.files.length) {
            let files: {
                img: string | ArrayBuffer;
                name: string;
                file: any;
            }[] = [];

            for (let f of e.target.files) {
                const res = await toBase64(f);
                files.push({ img: res, name: f.name, file: f });
            }

            setState({
                ...state,
                [e.target.name]: [...state[e.target.name], ...files],
            });
            e.target.value = "";
        }
    };

    const toBase64 = (file: any): Promise<string | ArrayBuffer | null> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const handleRemove = (i: number) => {
        setState({
            ...state,
            images: [...state.images].filter((a, index) => i !== index),
        });
    };

    const handleValidate = () => {
        const TmpErrors: IError = {
            image: [],
        };

        if (!state.images.length) {
            TmpErrors.image.push("Please browse at least one image.");
        }

        setErrors({ ...errors, ...TmpErrors });

        return TmpErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = handleValidate();

        for (let e of Object.values(errors)) {
            if (e.length) return;
        }

        setLoading(true);
        try {
            const formData = new FormData();

            for (let i of state.images) {
                formData.append("image", i.file);
            }

            const images = await apiCall<IImage[]>(
                "post",
                `/user_images?authId=${user.user_id}`,
                formData
            );

            mutate(
                `/user_images?authId=${user.user_id}`,
                (imgs: IImage[]) => {
                    return [
                        ...imgs.filter(
                            (i) =>
                                ![...images.map((i) => i.image_name)].includes(
                                    i.image_name
                                )
                        ),
                        ...images,
                    ];
                },
                false
            );
            close();
        } catch (err) {
            setLoading(false);
            setErrors({ ...errors, ...err });
        }
    };

    return (
        <Modal
            closeInfo={{
                close,
                check: true,
            }}
            type="child"
        >
            <div>
                <form onSubmit={handleSubmit}>
                    <Typography variant="h6">
                        Supported files extensions: (jpg, jpeg, svg, png, gif,
                        webp)
                    </Typography>
                    <Box
                        display="flex"
                        style={{ margin: "20px 0" }}
                        alignItems="center"
                    >
                        <Box display="flex" flexDirection="column">
                            <label>
                                <input
                                    accept="image/*"
                                    className={classes.input}
                                    id="contained-button-file"
                                    multiple
                                    name="images"
                                    type="file"
                                    onChange={handleChange}
                                />
                                <Button
                                    variant="contained"
                                    style={{
                                        backgroundColor: "#e6457a",
                                        color: "white",
                                    }}
                                    component="span"
                                >
                                    Browse device
                                </Button>
                            </label>
                        </Box>
                        <Typography style={{ margin: "0 15px" }}>
                            Selected files {state.images.length}
                        </Typography>
                    </Box>
                    <Error errors={errors.image} />
                    {state.images.length ? (
                        <Box
                            display="flex"
                            style={{ marginTop: "40px" }}
                            flexDirection="column"
                        >
                            {state.images.map((img, i) => (
                                <Grid
                                    style={{ marginBottom: "10px" }}
                                    container
                                    spacing={3}
                                    alignItems="center"
                                    key={i}
                                >
                                    <Grid item xs={2}>
                                        <div className={styles.imgContainer}>
                                            <img
                                                className={styles.img}
                                                src={img.img}
                                            />
                                        </div>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <Typography style={{ width: "100%" }}>
                                            {img.name}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Button
                                            variant="contained"
                                            id="showcase"
                                            color="secondary"
                                            startIcon={<DeleteIcon />}
                                            style={{
                                                width: "100%",
                                            }}
                                            onClick={() => handleRemove(i)}
                                        >
                                            remove
                                        </Button>
                                    </Grid>
                                </Grid>
                            ))}
                        </Box>
                    ) : null}
                    <Box
                        display="flex"
                        flexDirection="column"
                        style={{ marginTop: "20px" }}
                    >
                        <Button
                            style={{
                                backgroundColor: "#651fff",
                                color: "white",
                            }}
                            type="submit"
                            variant="contained"
                        >
                            {loading ? (
                                <CircularProgress style={{ color: "white" }} />
                            ) : (
                                "Submit"
                            )}
                        </Button>
                    </Box>
                </form>
            </div>
        </Modal>
    );
};

export default ImageForm;

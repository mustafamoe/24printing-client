import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootReducer } from "../../store/reducers";
import { apiCall } from "../../utils/apiCall";
import {
    Box,
    TextField,
    Divider,
    CircularProgress,
    Typography,
    FormLabel,
    Button,
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";

// components
import Modal from "../admin/modal";
import ImagePicker from "../userImage/imagePicker";
import Error from "../admin/error";
import { IReview } from "../../types/reviews";
import { IProduct } from "../../types/product";

interface IError {
    review_rating: string[];
    review_title: string[];
    review_description: string[];
}

interface IProps {
    close: any;
    review?: IReview;
    product: IProduct;
    handleEditPro: any;
}

const ReviewForm = ({ close, review, product, handleEditPro }: IProps) => {
    const [loading, setLoading] = useState(false);
    const user = useSelector((state: RootReducer) => state.auth.user);
    const [errors, setErrors] = useState<IError>({
        review_rating: [],
        review_title: [],
        review_description: [],
    });
    const [avatartInput, setAvatarInput] = useState(false);
    const [state, setState] = useState({
        review_rating: 0,
        review_title: "",
        review_description: "",
    });

    useEffect(() => {
        if (review) {
            setState({
                ...state,
                review_rating: review.review_rating,
                review_title: review.review_title,
                review_description: review.review_description,
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    const toggleAvatarInput = () => {
        if (avatartInput) {
            setAvatarInput(false);
        } else {
            setAvatarInput(true);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = handleValidate();

        for (let e of Object.values(errors)) {
            if (e.length) return;
        }

        if (!review) {
            try {
                setLoading(true);

                const review = await apiCall<IReview>(
                    "post",
                    `/review?authId=${user.user_id}&productId=${product.product_id}`,
                    state
                );
                console.log(review);
                handleEditPro({
                    ...product,
                    reviews: [review, ...product.reviews],
                });

                setLoading(false);
                close();
            } catch (err) {
                setLoading(false);
                setErrors({ ...errors, ...err });
            }
        } else {
            try {
                setLoading(true);

                const editedReview = await apiCall<IReview>(
                    "put",
                    `/review/${review.review_id}?authId=${user.user_id}`,
                    state
                );

                handleEditPro({
                    ...product,
                    reviews: product.reviews.map((r) =>
                        r.review_id === review.review_id ? editedReview : r
                    ),
                });

                setLoading(false);
                close();
            } catch (err) {
                setLoading(false);
                setErrors({ ...errors, ...err });
            }
        }
    };

    const handleValidate = () => {
        const TmpErrors: IError = {
            review_rating: [],
            review_title: [],
            review_description: [],
        };

        if (!state.review_rating) {
            TmpErrors.review_rating.push("Please leave your rating.");
        }

        if (!state.review_title) {
            TmpErrors.review_title.push("Please fill in title.");
        }

        if (!state.review_description) {
            TmpErrors.review_description.push("Please fill in description.");
        }

        setErrors({ ...errors, ...TmpErrors });

        return TmpErrors;
    };

    return (
        <>
            <Modal
                type="parent"
                closeInfo={{
                    close: close,
                    check: true,
                    msg: "Are you sure you want to close product review form?",
                }}
            >
                <form onSubmit={handleSubmit}>
                    <Box mb={5}>
                        <Typography variant="h5">Product review</Typography>
                    </Box>
                    <Box>
                        <Box mb={1}>
                            <FormLabel required>rating</FormLabel>
                        </Box>
                        <Rating
                            name="size-large"
                            precision={0.5}
                            size="large"
                            value={state.review_rating}
                            onChange={(event, newValue) => {
                                setState({ ...state, review_rating: newValue });
                            }}
                        />
                        <Error errors={errors.review_rating} />
                    </Box>
                    <Box mb={3} mt={3}>
                        <Divider />
                    </Box>
                    <Box mb={3}>
                        <TextField
                            name="review_title"
                            label="Title *"
                            size="small"
                            value={state.review_title}
                            error={!!errors.review_title?.length}
                            variant="outlined"
                            onChange={handleChange}
                            fullWidth
                        />
                        <Error errors={errors.review_title} />
                    </Box>
                    <Box mb={3} mt={3}>
                        <Divider />
                    </Box>
                    <Box style={{ margin: "30px 0" }}>
                        <TextField
                            name="review_description"
                            label="Description *"
                            size="small"
                            multiline
                            rows={10}
                            value={state.review_description}
                            error={!!errors.review_description?.length}
                            variant="outlined"
                            onChange={handleChange}
                            fullWidth
                        />
                        <Error errors={errors.review_description} />
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
                                <CircularProgress style={{ color: "white" }} />
                            ) : (
                                "Submit"
                            )}
                        </Button>
                    </Box>
                </form>
            </Modal>
            {avatartInput && (
                <ImagePicker
                    close={toggleAvatarInput}
                    state={state}
                    setState={setState}
                    type="single"
                    fieldName="avatar"
                />
            )}
        </>
    );
};

export default ReviewForm;

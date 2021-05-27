import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import {
    FormControlLabel,
    FormGroup,
    FormControl,
    FormLabel,
    Switch,
    Button,
    Box,
    CircularProgress,
    InputLabel,
    MenuItem,
    Select,
} from "@material-ui/core";
import { apiCall } from "../../../utils/apiCall";
import useSwr, { mutate } from "swr";
import { RootReducer } from "../../../store/reducers";
import { useSelector } from "react-redux";

// components
import Modal from "../modal";
import Error from "../error";
import { ISubCategory } from "../../../types/subCategory";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            "& > *": {},
        },
        grid: {
            flexGrow: 1,
        },
        formControl: {
            margin: theme.spacing(3),
        },
    })
);

interface IProps {
    close: Function;
    subCategory?: ISubCategory;
}

interface IState {
    sub_category_name: string;
    is_hidden: boolean;
    sub_category_order: string;
    category: string;
}

interface IError {
    sub_category_name: string[];
    is_hidden: string[];
    sub_category_order: string[];
    category: string[];
}

const SubCategoryForm = ({ close, subCategory }: IProps) => {
    const { data: categories } = useSwr("/categories");
    const classes = useStyles();
    const [loading, setLoading] = useState<boolean>(false);
    const [cLoading, setCLoading] = useState<boolean>(true);
    const user = useSelector((state: RootReducer) => state.auth.user);
    const [errors, setErrors] = useState<IError>({
        sub_category_name: [],
        is_hidden: [],
        sub_category_order: [],
        category: [],
    });
    const [state, setState] = useState<IState>({
        sub_category_name: "",
        sub_category_order: "",
        is_hidden: false,
        category: "",
    });

    useEffect(() => {
        if (subCategory) {
            setState({
                ...state,
                sub_category_name: subCategory.sub_category_name || "",
                sub_category_order: subCategory.sub_category_order || "",
                category: subCategory.category?.category_id || "",
                is_hidden: subCategory.is_hidden || false,
            });
        }
    }, []);

    useEffect(() => {
        if (categories) {
            setCLoading(false);
        }
    }, [categories]);

    const handleSwitch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, [e.target.name]: e.target.checked });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    const handleChangeNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        const vlaue = e.target.value;

        if (!Number.isNaN(Number(vlaue))) {
            setState({
                ...state,
                [e.target.name]: vlaue.trim().split(".", 1)[0],
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!loading) {
            const errors = handleValidate();

            for (let e of Object.values(errors)) {
                if (e.length) return;
            }

            try {
                if (!subCategory) {
                    setLoading(true);
                    const subCategory = await apiCall(
                        "post",
                        `/sub_category?authId=${user.user_id}`,
                        state
                    );

                    mutate(
                        "/sub_categories",
                        (subCategories) => {
                            return [...subCategories, subCategory];
                        },
                        false
                    );
                } else {
                    setLoading(true);
                    const editedSubCategory = await apiCall(
                        "put",
                        `/sub_category/${subCategory.sub_category_id}?authId=${user.user_id}`,
                        state
                    );

                    mutate(
                        "/sub_categories",
                        (subCategories) => {
                            return subCategories.map((sc) =>
                                sc.sub_category_id !==
                                subCategory.sub_category_id
                                    ? sc
                                    : editedSubCategory
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
            sub_category_name: [],
            is_hidden: [],
            sub_category_order: [],
            category: [],
        };

        if (!state.sub_category_name.trim()) {
            TmpErrors.sub_category_name.push("Please fill in category name.");
        }

        if (!state.sub_category_order) {
            TmpErrors.sub_category_order.push("Please fill in category order.");
        }

        if (!state.category) {
            TmpErrors.category.push("Please choose a category.");
        }

        setErrors({ ...errors, ...TmpErrors });

        return TmpErrors;
    };

    return (
        <>
            <Modal
                type="parent"
                width={50}
                closeInfo={{
                    close,
                    check: true,
                }}
            >
                <form
                    onSubmit={handleSubmit}
                    className={classes.root}
                    noValidate
                    autoComplete="off"
                >
                    <div>
                        <FormControl
                            component="fieldset"
                            className={classes.formControl}
                        >
                            <FormLabel component="legend">
                                Category Settings
                            </FormLabel>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={state.is_hidden}
                                            onChange={handleSwitch}
                                            name="is_hidden"
                                        />
                                    }
                                    label="Hidden"
                                />
                            </FormGroup>
                        </FormControl>
                        <Box mb={3}>
                            <TextField
                                id="sub_category_name"
                                name="sub_category_name"
                                label="Name"
                                size="small"
                                required={true}
                                value={state.sub_category_name}
                                error={!!errors.sub_category_name?.length}
                                variant="outlined"
                                onChange={handleChange}
                                style={{ width: "100%" }}
                            />
                            <Error errors={errors.sub_category_name} />
                        </Box>
                        <Box mb={3}>
                            <TextField
                                id="sub_category_order"
                                name="sub_category_order"
                                label="Order"
                                size="small"
                                required={true}
                                value={state.sub_category_order}
                                error={!!errors.sub_category_order?.length}
                                variant="outlined"
                                onChange={handleChangeNumber}
                                style={{ width: "100%" }}
                            />
                            <Error errors={errors.sub_category_order} />
                        </Box>
                        <Box position="relative">
                            <FormControl
                                variant="outlined"
                                size="small"
                                style={{ width: "100%" }}
                                error={!!errors.category?.length}
                            >
                                <InputLabel id="demo-simple-select-outlined-label">
                                    Category
                                </InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={state.category}
                                    name="category"
                                    onChange={handleChange}
                                    label="Category"
                                >
                                    {categories &&
                                        categories.map((category) => (
                                            <MenuItem
                                                value={category.category_id}
                                                key={category.category_id}
                                            >
                                                {category.category_name}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                            {cLoading && (
                                <Box
                                    position="absolute"
                                    style={{ transform: "translateY(-50%)" }}
                                    top="50%"
                                    right="50px"
                                >
                                    <CircularProgress
                                        style={{
                                            width: "20px",
                                            height: "20px",
                                        }}
                                    />
                                </Box>
                            )}
                            <Error errors={errors.category} />
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
        </>
    );
};

export default SubCategoryForm;

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
} from "@material-ui/core";
import { apiCall } from "../../../utils/apiCall";
import { mutate } from "swr";
import { RootReducer } from "../../../store/reducers";
import { useSelector } from "react-redux";
import { ICategory } from "../../../types/category";

// components
import Modal from "../modal";
import Error from "../error";

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
    category?: ICategory;
}

interface IState {
    category_name: string;
    is_hidden: boolean;
    category_order: string;
}

interface IError {
    category_name: string[];
    is_hidden: string[];
    category_order: string[];
}

const CategoryForm = ({ close, category }: IProps) => {
    const classes = useStyles();
    const [loading, setLoading] = useState<boolean>(false);
    const user = useSelector((state: RootReducer) => state.auth.user);
    const [errors, setErrors] = useState<IError>({
        category_name: [],
        is_hidden: [],
        category_order: [],
    });
    const [state, setState] = useState<IState>({
        category_name: "",
        category_order: "",
        is_hidden: false,
    });

    useEffect(() => {
        if (category) {
            setState({
                ...state,
                category_name: category.category_name || "",
                category_order: category.category_order || "",
                is_hidden: category.is_hidden || false,
            });
        }
    }, []);

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
                setLoading(true);

                if (!category) {
                    const category = await apiCall(
                        "post",
                        `/category?authId=${user.user_id}`,
                        state
                    );

                    mutate(
                        "/categories",
                        (categories) => {
                            return [
                                ...categories.map((c) =>
                                    c.category_order ===
                                    Number(state.category_order)
                                        ? {
                                              ...c,
                                              category_order:
                                                  categories.length + 1,
                                          }
                                        : c
                                ),
                                category,
                            ];
                        },
                        false
                    );
                } else {
                    const editedCategory = await apiCall(
                        "put",
                        `/category/${category.category_id}?authId=${user.user_id}`,
                        state
                    );

                    mutate(
                        "/categories",
                        (categories) => {
                            const toEditCatg = categories.find(
                                (c) =>
                                    Number(c.category_order) ===
                                    Number(state.category_order)
                            );

                            if (toEditCatg)
                                toEditCatg.category_order =
                                    category.category_order;

                            const foundCatg = categories.find(
                                (c) => c.category_id === category.category_id
                            );

                            if (foundCatg)
                                foundCatg.category_order = state.category_order;

                            return categories.map((c) =>
                                c.category_id === toEditCatg?.category_id
                                    ? toEditCatg
                                    : c.category_id === category.category_id
                                    ? foundCatg
                                    : c
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
            category_name: [],
            is_hidden: [],
            category_order: [],
        };

        if (!state.category_name.trim()) {
            TmpErrors.category_name.push("Please fill in category name.");
        }

        if (!state.category_order) {
            TmpErrors.category_order.push("Please fill in category order.");
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
                                id="category_name"
                                name="category_name"
                                label="Name"
                                size="small"
                                required={true}
                                value={state.category_name}
                                error={!!errors.category_name?.length}
                                variant="outlined"
                                onChange={handleChange}
                                style={{ width: "100%" }}
                            />
                            <Error errors={errors.category_name} />
                        </Box>
                        <Box mb={3}>
                            <TextField
                                id="category_order"
                                name="category_order"
                                label="Order"
                                size="small"
                                required={true}
                                value={state.category_order}
                                error={!!errors.category_order?.length}
                                variant="outlined"
                                onChange={handleChangeNumber}
                                style={{ width: "100%" }}
                            />
                            <Error errors={errors.category_order} />
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

export default CategoryForm;

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

// components
import Modal from "../modal";
import Error from "../error";
import { ISubCategory } from "../../../types/subCategory";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
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
    categoryId?: string;
    subCategoryOrder: number;
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

const SubCategoryForm = ({
    close,
    subCategory,
    categoryId,
    subCategoryOrder,
}: IProps) => {
    const classes = useStyles();
    const [loading, setLoading] = useState<boolean>(false);
    const user = useSelector((state: RootReducer) => state.auth.user);
    const [errors, setErrors] = useState<IError>({
        sub_category_name: [],
        is_hidden: [],
        sub_category_order: [],
        category: [],
    });
    const [state, setState] = useState<IState>({
        sub_category_name: "",
        sub_category_order: `${subCategoryOrder}`,
        is_hidden: false,
        category: categoryId,
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

    const handleSwitch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, [e.target.name]: e.target.checked });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    const handleChangeNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (!Number.isNaN(Number(value))) {
            setState({
                ...state,
                [e.target.name]: value.trim().split(".", 1)[0],
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
                        `/sub_categories?categoryId=${categoryId}`,
                        (subCategories: ISubCategory[]) => {
                            return [
                                ...subCategories.map((c: ISubCategory) =>
                                    Number(c.sub_category_order) ===
                                    Number(state.sub_category_order)
                                        ? {
                                              ...c,
                                              sub_category_order:
                                                  subCategories.length + 1,
                                          }
                                        : c
                                ),
                                subCategory,
                            ];
                        },
                        false
                    );
                } else {
                    setLoading(true);
                    const editedSubCategory = await apiCall<ISubCategory>(
                        "put",
                        `/sub_category/${subCategory.sub_category_id}?authId=${user.user_id}`,
                        state
                    );

                    mutate(
                        `/sub_categories?categoryId=${categoryId}`,
                        (subCategories) => {
                            const toSubEditCatg = subCategories.find(
                                (c) =>
                                    Number(c.sub_category_order) ===
                                    Number(state.sub_category_order)
                            );

                            if (toSubEditCatg)
                                toSubEditCatg.sub_category_order =
                                    subCategory.sub_category_order;

                            return subCategories.map((c) =>
                                c.sub_category_id ===
                                editedSubCategory?.sub_category_id
                                    ? editedSubCategory
                                    : c.sub_category_id ===
                                      toSubEditCatg.sub_category_id
                                    ? toSubEditCatg
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
                <form onSubmit={handleSubmit} noValidate autoComplete="off">
                    <div>
                        <FormControl
                            component="fieldset"
                            className={classes.formControl}
                        >
                            <FormLabel component="legend">
                                Sub Category Settings
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

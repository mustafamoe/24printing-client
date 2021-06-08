import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import {
    Grid,
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
    Typography,
    Divider,
    AccordionSummary,
    Accordion,
    AccordionDetails,
    Tabs,
    Tab,
} from "@material-ui/core";
import TextEditor from "../textEditor";
import { IProduct } from "../../../types/product";
import DeleteIcon from "@material-ui/icons/Delete";
import { apiCall } from "../../../utils/apiCall";
import { mutate } from "swr";
import { RootReducer } from "../../../store/reducers";
import { useSelector } from "react-redux";
import { ICustomization } from "../../../types/customization";
import useSWR from "swr";
import { IImage } from "../../../types/image";
import { IQuantity } from "../../../types/quantity";
import { IDesigner } from "../../../types/designer";

// components
import Modal from "../modal";
import Error from "../error";
import OptionPicker from "../option/optionPicker";
import ImagePicker from "../gallery/imagePicker";
import CardForm from "../card/cardForm";
import DropdownForm from "../dropdown/dropdownForm";
import ImageOpt from "../../imageOpt";

// icons
import AddIcon from "@material-ui/icons/Add";
import SettingsIcon from "@material-ui/icons/Settings";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ViewCarouselRoundedIcon from "@material-ui/icons/ViewCarouselRounded";
import DoneAllRoundedIcon from "@material-ui/icons/DoneAllRounded";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        grid: {
            flexGrow: 1,
        },
        formControl: {
            margin: theme.spacing(3),
        },
        heading: {
            fontSize: theme.typography.pxToRem(20),
            textAlign: "center",
            width: "100%",
        },
        secondaryHeading: {
            fontSize: theme.typography.pxToRem(20),
            color: theme.palette.text.secondary,
        },
        designImgContainer: {
            position: "relative",
            width: "100px",
            height: "100px",
        },
        designTitle: {
            whiteSpace: "nowrap",
        },
    })
);

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
            {value === index && <Box p={2}>{children}</Box>}
        </div>
    );
};

const a11yProps = (index: any) => {
    return {
        id: `full-width-tab-${index}`,
        "aria-controls": `full-width-tabpanel-${index}`,
    };
};

interface IProps {
    close: Function;
    product?: IProduct;
}

interface IState {
    product_name: string;
    image: string;
    showcase: string[];
    about: string;
    product_description: string;
    quantities: IQuantity[];
    is_eligible: boolean;
    is_designer: boolean;
    is_featured: boolean;
    is_published: boolean;
    category: string;
    sub_category: string;
    customizations: ICustomization[];
    designer: IDesigner[];
}

interface IError {
    image: string[];
    showcase: string[];
    product_name: string[];
    about: string[];
    product_description: string[];
    quantities: string[];
    category: string[];
    sub_category: string[];
    customizations: string[];
    designer: string[];
}

const ProductForm = ({ close, product }: IProps) => {
    const classes = useStyles();
    const [isImage, setImage] = useState<boolean>(false);
    const [isShowcase, setShowcase] = useState<boolean>(false);
    const [isOptionPik, setOptionPik] = useState<boolean>(false);
    const [expanded, setExpanded] = useState<string | false>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const user = useSelector((state: RootReducer) => state.auth.user);
    const [designerImg, setDesignerImg] = useState(false);
    const [designerOl, setDesignerOl] = useState(false);
    const { data: images } = useSWR<IImage[]>("/images");
    const [state, setState] = useState<IState>({
        product_name: "",
        image: "",
        showcase: [],
        about: "",
        product_description: "",
        quantities: [],
        is_designer: false,
        is_eligible: false,
        is_featured: false,
        is_published: true,
        category: "",
        sub_category: "",
        customizations: [],
        designer: [],
    });
    const { data: categories } = useSWR("/categories");
    const [cLoading, setCLoading] = useState<boolean>(true);
    const { data: subCategories, isValidating } = useSWR(
        state.category ? `/sub_categories?categoryId=${state.category}` : null
    );
    const [errors, setErrors] = useState<IError>({
        image: [],
        showcase: [],
        product_name: [],
        about: [],
        product_description: [],
        quantities: [],
        category: [],
        sub_category: [],
        customizations: [],
        designer: [],
    });
    const [quantity, setQuantity] = useState({
        qty: "",
        price: "",
    });
    const [designer, setDesigner] = useState({
        image: "",
        overlay: "",
    });

    useEffect(() => {
        if (product) {
            setState({
                ...state,
                product_name: product.product_name,
                image: product.image?.image_id || "",
                showcase: product.showcase?.map((img) => img.image_id) || [],
                about: product.about,
                product_description: product.product_description,
                quantities: (product.quantities as any) || [],
                is_eligible: product.is_eligible,
                is_designer: product.is_designer,
                is_featured: product.is_featured,
                is_published: product.is_published,
                category: product.category?.category_id || "",
                sub_category: product.sub_category?.sub_category_id || "",
                customizations: product.customizations,
                designer: product.designer,
            });
        }
    }, []);

    useEffect(() => {
        if (categories) setCLoading(false);
    }, [categories]);

    const handleOpenMedia = (type: "image" | "showcase") => {
        if (type === "image") setImage(true);
        else if (type === "showcase") setShowcase(true);
    };

    const handleCloseMedia = (type: "image" | "showcase") => {
        if (type === "image") setImage(false);
        else if (type === "showcase") setShowcase(false);
    };

    const handleOpenOptionPik = () => {
        setOptionPik(true);
    };

    const handleCloseOptionPik = () => {
        setOptionPik(false);
    };

    const handleSwitch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, [e.target.name]: e.target.checked });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    const handleEditorChange = (e: any, name: string): void => {
        setState({ ...state, [name]: e });
    };

    // quantities ---------- start
    const handleQty = (e, i) => {
        if (!Number.isNaN(Number(e.target.value))) {
            const tmpQuantities = [...state.quantities].map((q, index) => {
                if (i === index) return { ...q, qty: e.target.value.trim() };
                return q;
            });

            setState({ ...state, quantities: tmpQuantities });
        }
    };

    const handlePrice = (e, i) => {
        if (!Number.isNaN(Number(e.target.value))) {
            const tmpQuantities = [...state.quantities].map((q, index) => {
                if (i === index) return { ...q, price: e.target.value.trim() };
                return q;
            });

            setState({ ...state, quantities: tmpQuantities });
        }
    };

    const handleTmpQty = (e) => {
        if (!Number.isNaN(Number(e.target.value))) {
            setQuantity({ ...quantity, qty: e.target.value.trim() });
        }
    };

    const handleTmpPrice = (e) => {
        if (!Number.isNaN(Number(e.target.value))) {
            setQuantity({ ...quantity, price: e.target.value.trim() });
        }
    };

    const handleAddQty = () => {
        if (!quantity.qty || !quantity.price) return;

        const foundQty = state.quantities.find((q) => {
            return Number(q.qty) === Number(quantity.qty);
        });

        if (foundQty) {
            setErrors({
                ...errors,
                quantities: [
                    `You have already entered a quantity of ${quantity.qty}`,
                ],
            });

            return;
        } else {
            setErrors({
                ...errors,
                quantities: [],
            });
        }

        setState({
            ...state,
            quantities: [
                ...state.quantities,
                {
                    quantity_id: String(Date.now()),
                    qty: Number(quantity.qty),
                    price: Number(quantity.price),
                },
            ],
        });

        setQuantity({ ...state, qty: "", price: "" });
    };

    const handleRemove = (i) => {
        setState({
            ...state,
            quantities: [...state.quantities].filter((q, index) => index !== i),
        });
    };

    // customizations ---------- start
    const handlePanel =
        (panel: string) =>
        (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };

    const handleActiveTab = (
        e: React.ChangeEvent<{}>,
        newValue: number,
        cusId
    ) => {
        switch (newValue) {
            case 0:
                setState({
                    ...state,
                    customizations: state.customizations.map((c) =>
                        c.option?.option_id === cusId
                            ? { ...c, type: "card" }
                            : c
                    ),
                });

                return;
            case 1:
                setState({
                    ...state,
                    customizations: state.customizations.map((c) =>
                        c.option?.option_id === cusId
                            ? { ...c, type: "dropdown" }
                            : c
                    ),
                });

                return;
            default:
                return;
        }
    };

    // ----------------------- designer
    const handleOpenDesignerMedia = (name: "image" | "overlay") => {
        if (name === "image") setDesignerImg(true);
        else if (name === "overlay") setDesignerOl(true);
    };

    const handleCloseDesignerMedia = (name: "image" | "overlay") => {
        if (name === "image") setDesignerImg(false);
        else if (name === "overlay") setDesignerOl(false);
    };

    const handleAddDesigner = () => {
        if (state.is_designer) {
            if (!designer.image || !designer.overlay) {
                return setErrors({
                    ...errors,
                    designer: [
                        "Please choose designer image and overlay image.",
                    ],
                });
            }

            setState({
                ...state,
                designer: [
                    ...state.designer,
                    {
                        designer_id: String(Date.now()),
                        image: images.find(
                            (i) => i.image_id === designer.image
                        ),
                        overlay: images.find(
                            (i) => i.image_id === designer.overlay
                        ),
                    },
                ],
            });
            setDesigner({
                image: "",
                overlay: "",
            });
        }
    };

    const handleRemoveDesigner = (designerId: string) => {
        setState({
            ...state,
            designer: state.designer.filter(
                (d) => d.designer_id !== designerId
            ),
        });
    };

    //  ---------------------------------- form submition
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!loading) {
            const errors = handleValidate();

            for (let e of Object.values(errors)) {
                if (e.length) return;
            }

            try {
                if (!product) {
                    setLoading(true);
                    const product = await apiCall(
                        "post",
                        `/product?authId=${user.user_id}`,
                        state
                    );

                    mutate(
                        "/products",
                        (products) => {
                            return [...products, product];
                        },
                        false
                    );
                } else {
                    setLoading(true);
                    const editedProduct = await apiCall(
                        "put",
                        `/product/${product.product_id}?authId=${user.user_id}`,
                        state
                    );

                    mutate(
                        "/products",
                        (products) => {
                            return products.map((p) =>
                                p.product_id !== product.product_id
                                    ? p
                                    : editedProduct
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
            showcase: [],
            product_name: [],
            about: [],
            product_description: [],
            quantities: [],
            category: [],
            sub_category: [],
            customizations: [],
            designer: [],
        };

        if (!state.product_name) {
            TmpErrors.product_name.push("Please fill in product name.");
        }

        if (!state.product_description) {
            TmpErrors.product_description.push(
                "Please fill in product description."
            );
        }

        if (!state.about) {
            TmpErrors.about.push("Please fill in about this product.");
        }

        if (!state.image) {
            TmpErrors.image.push("Please choose an image.");
        }

        if (!state.showcase.length) {
            TmpErrors.showcase.push("Please choose at least one image.");
        }

        if (!state.quantities.length) {
            TmpErrors.quantities.push("Please enter at least one quantity.");
        }

        if (!state.category.length) {
            TmpErrors.category.push("Please choose a category.");
        }

        if (state.is_designer && !state.designer.length) {
            TmpErrors.designer.push(
                "Please choose at least on designer option."
            );
        }

        for (let c of state.customizations) {
            if (c.type === "card") {
                if (!c.cards.length)
                    TmpErrors.customizations.push(
                        "Please enter at least one option for each customization."
                    );
                break;
            } else if (c.type === "dropdown") {
                if (!c.dropdown.length)
                    TmpErrors.customizations.push(
                        "Please enter at least one option for each customization."
                    );
                break;
            }
        }

        setErrors({ ...errors, ...TmpErrors });

        return TmpErrors;
    };

    // ---------------------- card size
    const getCardSizeValue = (size: "small" | "medium" | "large") => {
        if (size === "small") return 0;
        else if (size === "medium") return 1;
        else if (size === "large") return 2;
    };

    const handleCardSize = (
        e: any,
        newValue: number,
        customization_id: string
    ) => {
        switch (newValue) {
            case 0:
                setState({
                    ...state,
                    customizations: state.customizations.map((c) =>
                        c.customization_id === customization_id
                            ? { ...c, size: "small" }
                            : c
                    ),
                });

                return;
            case 1:
                setState({
                    ...state,
                    customizations: state.customizations.map((c) =>
                        c.customization_id === customization_id
                            ? { ...c, size: "medium" }
                            : c
                    ),
                });

                return;
            case 2:
                setState({
                    ...state,
                    customizations: state.customizations.map((c) =>
                        c.customization_id === customization_id
                            ? { ...c, size: "large" }
                            : c
                    ),
                });

                return;
            default:
                return;
        }
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
                        <FormControl
                            component="fieldset"
                            className={classes.formControl}
                        >
                            <FormLabel component="legend">
                                Product Settings
                            </FormLabel>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={state.is_designer}
                                            onChange={handleSwitch}
                                            name="is_designer"
                                        />
                                    }
                                    label="Designer"
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={state.is_eligible}
                                            onChange={handleSwitch}
                                            name="is_eligible"
                                        />
                                    }
                                    label="Eligible for 24hr"
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={state.is_featured}
                                            onChange={handleSwitch}
                                            name="is_featured"
                                        />
                                    }
                                    label="Featured"
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={state.is_published}
                                            onChange={handleSwitch}
                                            name="is_published"
                                        />
                                    }
                                    label="Published"
                                />
                            </FormGroup>
                        </FormControl>
                        {state.is_designer && (
                            <>
                                <Box mb={3} mt={3}>
                                    <Divider />
                                </Box>
                                <Box mb={3}>
                                    <Typography variant="h6">
                                        Product Designer
                                    </Typography>
                                </Box>
                                <Box width="100%">
                                    {!state.designer.length ? (
                                        <Box mb={2}>
                                            <Typography>
                                                No designer options chosen.
                                            </Typography>
                                        </Box>
                                    ) : (
                                        state.designer.map((d) => (
                                            <Box
                                                display="flex"
                                                key={d.designer_id}
                                                width="100%"
                                                justifyContent="space-between"
                                                alignItems="center"
                                            >
                                                <Box display="flex">
                                                    <Box
                                                        mr={3}
                                                        display="flex"
                                                        alignItems="center"
                                                        flexDirection="column"
                                                    >
                                                        <Typography
                                                            classes={{
                                                                root: classes.designTitle,
                                                            }}
                                                        >
                                                            Main image
                                                        </Typography>
                                                        <Box
                                                            className={
                                                                classes.designImgContainer
                                                            }
                                                        >
                                                            <ImageOpt
                                                                src={
                                                                    d.image
                                                                        .image_name
                                                                }
                                                                layout="fill"
                                                                objectFit="contain"
                                                            />
                                                        </Box>
                                                    </Box>
                                                    <Box
                                                        className={
                                                            classes.designImgContainer
                                                        }
                                                        display="flex"
                                                        alignItems="center"
                                                        flexDirection="column"
                                                    >
                                                        <Typography
                                                            classes={{
                                                                root: classes.designTitle,
                                                            }}
                                                        >
                                                            Overlay image
                                                        </Typography>
                                                        <Box
                                                            className={
                                                                classes.designImgContainer
                                                            }
                                                        >
                                                            <ImageOpt
                                                                src={
                                                                    d.overlay
                                                                        .image_name
                                                                }
                                                                layout="fill"
                                                                objectFit="contain"
                                                            />
                                                        </Box>
                                                    </Box>
                                                </Box>
                                                <Box>
                                                    <Button
                                                        variant="contained"
                                                        startIcon={
                                                            <DeleteIcon />
                                                        }
                                                        style={{
                                                            height: "100%",
                                                            width: "100%",
                                                            backgroundColor:
                                                                "red",
                                                            color: "white",
                                                        }}
                                                        onClick={() =>
                                                            handleRemoveDesigner(
                                                                d.designer_id
                                                            )
                                                        }
                                                    >
                                                        remove
                                                    </Button>
                                                </Box>
                                            </Box>
                                        ))
                                    )}
                                </Box>
                                <Grid
                                    container
                                    alignItems="center"
                                    spacing={10}
                                >
                                    <Grid item xs={5}>
                                        <FormGroup>
                                            <FormLabel
                                                required={true}
                                                style={{ marginBottom: "10px" }}
                                                htmlFor="image"
                                            >
                                                Product main image
                                            </FormLabel>
                                            <Button
                                                variant="contained"
                                                onClick={() =>
                                                    handleOpenDesignerMedia(
                                                        "image"
                                                    )
                                                }
                                                color="primary"
                                            >
                                                open gallery
                                            </Button>
                                        </FormGroup>
                                    </Grid>
                                    <Grid item xs={5}>
                                        <FormGroup>
                                            <FormLabel
                                                required={true}
                                                style={{ marginBottom: "10px" }}
                                                htmlFor="showcase"
                                            >
                                                Product showcase images
                                            </FormLabel>
                                            <Button
                                                variant="contained"
                                                onClick={() =>
                                                    handleOpenDesignerMedia(
                                                        "overlay"
                                                    )
                                                }
                                                color="primary"
                                            >
                                                open gallery
                                            </Button>
                                        </FormGroup>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Button
                                            variant="contained"
                                            startIcon={<AddIcon />}
                                            id="showcase"
                                            style={{
                                                height: "100%",
                                                width: "100%",
                                            }}
                                            onClick={handleAddDesigner}
                                            color="secondary"
                                        >
                                            add
                                        </Button>
                                    </Grid>
                                </Grid>
                                <Error errors={errors.designer} />
                            </>
                        )}
                        <Box mb={3} mt={3}>
                            <Divider />
                        </Box>
                        <Grid container spacing={10}>
                            <Grid item xs={6}>
                                <FormGroup>
                                    <FormLabel
                                        required={true}
                                        style={{ marginBottom: "10px" }}
                                        htmlFor="image"
                                    >
                                        Product main image
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
                            <Grid item xs={6}>
                                <FormGroup>
                                    <FormLabel
                                        required={true}
                                        style={{ marginBottom: "10px" }}
                                        htmlFor="showcase"
                                    >
                                        Product showcase images
                                    </FormLabel>
                                    <Button
                                        variant="contained"
                                        onClick={() =>
                                            handleOpenMedia("showcase")
                                        }
                                        color="primary"
                                    >
                                        open gallery
                                    </Button>
                                </FormGroup>
                                <Error errors={errors.showcase} />
                            </Grid>
                        </Grid>
                        <Box mb={3} mt={3}>
                            <Divider />
                        </Box>
                        <Box mb={3}>
                            <TextField
                                name="product_name"
                                label="Name"
                                size="small"
                                required={true}
                                value={state.product_name}
                                error={!!errors.product_name?.length}
                                variant="outlined"
                                onChange={handleChange}
                                fullWidth
                            />
                            <Error errors={errors.product_name} />
                        </Box>
                        <Box mb={3} mt={3}>
                            <Divider />
                        </Box>
                        <Box display="flex">
                            <Box flexGrow={1} position="relative">
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
                                        style={{
                                            transform: "translateY(-50%)",
                                        }}
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
                            <Box ml={4} flexGrow={1} position="relative">
                                <FormControl
                                    variant="outlined"
                                    size="small"
                                    style={{ width: "100%" }}
                                >
                                    <InputLabel id="demo-simple-select-outlined-label">
                                        Sub category
                                    </InputLabel>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        value={state.sub_category}
                                        name="sub_category"
                                        onChange={handleChange}
                                        label="Sub category"
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        {subCategories &&
                                            subCategories.map((subCategory) => (
                                                <MenuItem
                                                    value={
                                                        subCategory.sub_category_id
                                                    }
                                                    key={
                                                        subCategory.sub_category_id
                                                    }
                                                >
                                                    {
                                                        subCategory.sub_category_name
                                                    }
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                                {isValidating && (
                                    <Box
                                        position="absolute"
                                        style={{
                                            transform: "translateY(-50%)",
                                        }}
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
                            </Box>
                        </Box>
                        <Box mb={3} mt={3}>
                            <Divider />
                        </Box>
                        <Box mb={3}>
                            <Box mb={3}>
                                <FormLabel required>
                                    Product Quantities
                                </FormLabel>
                            </Box>
                            <Box display="flex" flexDirection="column">
                                {state.quantities.map((q, i) => (
                                    <Grid
                                        style={{ marginBottom: "20px" }}
                                        container
                                        key={i}
                                        spacing={3}
                                    >
                                        <Grid item xs={5}>
                                            <TextField
                                                type="text"
                                                name="qty"
                                                label="Quantity"
                                                required
                                                size="small"
                                                variant="outlined"
                                                value={q.qty}
                                                onChange={(e) =>
                                                    handleQty(e, i)
                                                }
                                                style={{ width: "100%" }}
                                            />
                                        </Grid>
                                        <Grid item xs={5}>
                                            <TextField
                                                name="price"
                                                label="Price"
                                                required
                                                type="text"
                                                size="small"
                                                variant="outlined"
                                                value={q.price}
                                                onChange={(e) =>
                                                    handlePrice(e, i)
                                                }
                                                style={{ width: "100%" }}
                                            />
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Button
                                                variant="contained"
                                                startIcon={<DeleteIcon />}
                                                style={{
                                                    height: "100%",
                                                    width: "100%",
                                                    backgroundColor: "red",
                                                    color: "white",
                                                }}
                                                onClick={() => handleRemove(i)}
                                            >
                                                remove
                                            </Button>
                                        </Grid>
                                    </Grid>
                                ))}
                            </Box>
                            <Grid container spacing={3}>
                                <Grid item xs={5}>
                                    <TextField
                                        id="qty"
                                        type="text"
                                        error={!!errors.quantities?.length}
                                        required
                                        name="qty"
                                        label="Quantity"
                                        variant="outlined"
                                        onChange={handleTmpQty}
                                        size="small"
                                        value={quantity.qty}
                                        style={{ width: "100%" }}
                                    />
                                </Grid>
                                <Grid item xs={5}>
                                    <TextField
                                        id="price"
                                        type="text"
                                        error={!!errors.quantities?.length}
                                        required
                                        name="price"
                                        label="Price"
                                        variant="outlined"
                                        value={quantity.price}
                                        onChange={handleTmpPrice}
                                        size="small"
                                        style={{ width: "100%" }}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        id="showcase"
                                        style={{
                                            height: "100%",
                                            width: "100%",
                                        }}
                                        onClick={handleAddQty}
                                        color="secondary"
                                    >
                                        add
                                    </Button>
                                </Grid>
                            </Grid>
                            <Error errors={errors.quantities} />
                        </Box>
                        <Box mb={3} mt={3}>
                            <Divider />
                        </Box>
                        <Box display="flex" flexDirection="column">
                            <Box
                                style={{
                                    backgroundColor: "rgb(240, 240, 240)",
                                    padding: "10px",
                                }}
                                display="flex"
                                flexDirection="column"
                            >
                                {!state.quantities.length ? (
                                    <Box>
                                        <Typography>
                                            Please enter at least one quantity
                                            before using product customization.
                                        </Typography>
                                    </Box>
                                ) : !state.customizations.length ? (
                                    <Box>
                                        <Typography>
                                            No customization options is
                                            selected.
                                        </Typography>
                                    </Box>
                                ) : (
                                    state.customizations.map((c) => (
                                        <Accordion
                                            key={c.customization_id}
                                            expanded={
                                                expanded === c.option?.option_id
                                            }
                                            onChange={handlePanel(
                                                c.option?.option_id
                                            )}
                                        >
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                            >
                                                <Typography
                                                    className={classes.heading}
                                                >
                                                    {c.option?.option_name}
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Box
                                                    display="flex"
                                                    flexDirection="column"
                                                    width={"100%"}
                                                >
                                                    <Tabs
                                                        value={
                                                            c.type === "card"
                                                                ? 0
                                                                : 1
                                                        }
                                                        onChange={(
                                                            e,
                                                            newValue
                                                        ) =>
                                                            handleActiveTab(
                                                                e,
                                                                newValue,
                                                                c.option
                                                                    .option_id
                                                            )
                                                        }
                                                        indicatorColor="primary"
                                                        textColor="primary"
                                                        variant="fullWidth"
                                                    >
                                                        <Tab
                                                            label="Cards"
                                                            icon={
                                                                <ViewCarouselRoundedIcon />
                                                            }
                                                            {...a11yProps(0)}
                                                        />
                                                        <Tab
                                                            label="Drop down"
                                                            icon={
                                                                <DoneAllRoundedIcon />
                                                            }
                                                            {...a11yProps(1)}
                                                        />
                                                    </Tabs>
                                                    <TabPanel
                                                        value={
                                                            c.type === "card"
                                                                ? 0
                                                                : 1
                                                        }
                                                        index={0}
                                                    >
                                                        <Box>
                                                            <Box mb={3}>
                                                                <Tabs
                                                                    variant="fullWidth"
                                                                    value={getCardSizeValue(
                                                                        c.size
                                                                    )}
                                                                    indicatorColor="secondary"
                                                                    textColor="secondary"
                                                                    onChange={(
                                                                        e,
                                                                        newValue
                                                                    ) =>
                                                                        handleCardSize(
                                                                            e,
                                                                            newValue,
                                                                            c.customization_id
                                                                        )
                                                                    }
                                                                >
                                                                    <Tab
                                                                        {...a11yProps(
                                                                            0
                                                                        )}
                                                                        label="small"
                                                                    />
                                                                    <Tab
                                                                        {...a11yProps(
                                                                            1
                                                                        )}
                                                                        label="medium"
                                                                    />
                                                                    <Tab
                                                                        {...a11yProps(
                                                                            2
                                                                        )}
                                                                        label="large"
                                                                    />
                                                                </Tabs>
                                                            </Box>
                                                            <CardForm
                                                                quantities={
                                                                    state.quantities
                                                                }
                                                                state={state}
                                                                setState={
                                                                    setState
                                                                }
                                                                optionId={
                                                                    c.option
                                                                        ?.option_id
                                                                }
                                                            />
                                                        </Box>
                                                    </TabPanel>
                                                    <TabPanel
                                                        value={
                                                            c.type === "card"
                                                                ? 0
                                                                : 1
                                                        }
                                                        index={1}
                                                    >
                                                        <Box>
                                                            <DropdownForm
                                                                quantities={
                                                                    state.quantities
                                                                }
                                                                state={state}
                                                                setState={
                                                                    setState
                                                                }
                                                                optionId={
                                                                    c.option
                                                                        ?.option_id
                                                                }
                                                            />
                                                        </Box>
                                                    </TabPanel>
                                                </Box>
                                            </AccordionDetails>
                                        </Accordion>
                                    ))
                                )}
                            </Box>
                            <Box mt={3}>
                                <Button
                                    disabled={
                                        state.quantities.length ? false : true
                                    }
                                    color="primary"
                                    startIcon={<SettingsIcon />}
                                    variant="contained"
                                    onClick={handleOpenOptionPik}
                                    fullWidth
                                >
                                    choose customization option
                                </Button>
                            </Box>
                            <Error errors={errors.customizations} />
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
                                About this product
                            </FormLabel>
                            <TextEditor
                                id="about"
                                name="about"
                                value={state.about}
                                onChange={handleEditorChange}
                            />
                            <Error errors={errors.about} />
                        </FormGroup>
                        <FormGroup style={{ margin: "30px 0" }}>
                            <FormLabel
                                style={{ marginBottom: "10px" }}
                                required={true}
                                htmlFor="product_description"
                            >
                                Product description
                            </FormLabel>
                            <TextEditor
                                id="product_description"
                                name="product_description"
                                value={state.product_description}
                                onChange={handleEditorChange}
                            />
                            <Error errors={errors.product_description} />
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
            {designerImg && (
                <ImagePicker
                    state={designer}
                    setState={setDesigner}
                    fieldName="image"
                    close={() => handleCloseDesignerMedia("image")}
                    type="single"
                />
            )}
            {designerOl && (
                <ImagePicker
                    state={designer}
                    setState={setDesigner}
                    fieldName="overlay"
                    close={() => handleCloseDesignerMedia("overlay")}
                    type="single"
                />
            )}
            {isOptionPik && (
                <OptionPicker
                    state={state}
                    setState={setState}
                    close={handleCloseOptionPik}
                />
            )}
        </>
    );
};

export default ProductForm;

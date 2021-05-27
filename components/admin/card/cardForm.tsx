import {
    Box,
    Typography,
    Grid,
    FormLabel,
    Divider,
    TextField,
    Button,
} from "@material-ui/core";
import { useState, useEffect } from "react";
import { IQuantity } from "../../../types/quantity";

// components
import Error from "../error";
import ImagePicker from "../gallery/imagePicker";

// icons
import AddIcon from "@material-ui/icons/Add";
import { ICustomization } from "../../../types/customization";
import DeleteIcon from "@material-ui/icons/Delete";
import ImageOpt from "../../imageOpt";
import useSwr from "swr";
import { IImage } from "../../../types/image";

interface IProps {
    quantities: IQuantity[];
    state: any;
    setState: any;
    optionId: string;
}

interface IError {
    image: string[];
    title: string[];
}

const CardForm = ({ quantities, state, setState, optionId }: IProps) => {
    const [tmpQtys, setTmpQtys] = useState<IQuantity[]>([]);
    const [isImage, setImage] = useState<boolean>(false);
    const { data: images } = useSwr<IImage[]>("/images");
    const [customization, setCustomization] =
        useState<ICustomization | null>(null);
    const [errors, setErrors] = useState<IError>({
        image: [],
        title: [],
    });
    const [cardInfo, setCardInfo] = useState({
        image: "",
        title: "",
    });

    useEffect(() => {
        setCustomization(
            state.customizations.find(
                (c: ICustomization) => c.option.option_id === optionId
            ) || null
        );
    }, [state.customizations]);

    useEffect(() => {
        const tmpTmpQtys: IQuantity[] = [];

        for (let qty of quantities) {
            const foundQty = tmpQtys.find(
                (q) => q.quantity_id === qty.quantity_id
            );

            if (!foundQty) {
                tmpTmpQtys.push({ ...qty, price: 0 });

                continue;
            }

            tmpTmpQtys.push({ ...qty, price: foundQty.price });
        }

        setTmpQtys(tmpTmpQtys);

        const tmpCust: ICustomization[] = [];

        for (let c of state.customizations) {
            const tmpCards: any = [];

            for (let card of c.cards) {
                tmpCards.push({
                    ...card,
                    prices: quantities.map((q) => {
                        const cQty = card.prices.find(
                            (qty) => qty.quantity_id === q.quantity_id
                        );

                        if (cQty) return cQty;

                        const foundQty = tmpQtys.find(
                            (qty) => qty.quantity_id === q.quantity_id
                        );

                        if (foundQty) return { ...q, price: foundQty.price };
                        return { ...q, price: 0 };
                    }),
                });
            }

            tmpCust.push({ ...c, cards: tmpCards });
        }

        setState({ ...state, customizations: tmpCust });
    }, [quantities]);

    const handleOpenMedia = (type: "image") => {
        if (type === "image") setImage(true);
    };

    const handleCloseMedia = (type: "image") => {
        if (type === "image") setImage(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCardInfo({ ...cardInfo, [e.target.name]: e.target.value });
    };

    const handlePrice = (e, id) => {
        if (!e.target.value) {
            setTmpQtys([
                ...tmpQtys.map((q) =>
                    q.quantity_id === id ? { ...q, [e.target.name]: "0" } : q
                ),
            ]);

            return;
        }

        if (!Number.isNaN(Number(e.target.value))) {
            setTmpQtys([
                ...tmpQtys.map((q) =>
                    q.quantity_id === id
                        ? { ...q, [e.target.name]: e.target.value.trim() }
                        : q
                ),
            ]);
        }
    };

    const handleAdd = () => {
        const errors = handleValidate();

        for (let e of Object.values(errors)) {
            if (e.length) return;
        }

        const card = {
            ...cardInfo,
            prices: tmpQtys,
            image:
                images.find((i) => i.image_id === cardInfo.image) ||
                cardInfo.image,
        };

        setState({
            ...state,
            customizations: state.customizations.map((c: ICustomization) =>
                c.option.option_id === optionId
                    ? { ...c, cards: [...c.cards, card] }
                    : c
            ),
        });

        setCardInfo({
            ...cardInfo,
            title: "",
            image: "",
        });

        setTmpQtys(quantities.map((q) => ({ ...q, price: 0 })));
    };

    const handleRemove = (i) => {
        setState({
            ...state,
            customizations: state.customizations.map((c: ICustomization) =>
                c.option.option_id === optionId
                    ? {
                          ...c,
                          cards: c.cards.filter((card, index) => index !== i),
                      }
                    : c
            ),
        });
    };

    const handleValidate = () => {
        const TmpErrors: IError = {
            image: [],
            title: [],
        };

        if (!cardInfo.title) {
            TmpErrors.title.push("Please fill in title.");
        }

        if (!cardInfo.image) {
            TmpErrors.image.push("Please choose an image.");
        }

        setErrors({ ...errors, ...TmpErrors });

        return TmpErrors;
    };

    return (
        <>
            <Box display="flex" flexDirection="column">
                {!customization?.cards.length ? (
                    <Box>
                        <Typography>No cards added.</Typography>
                    </Box>
                ) : (
                    customization?.cards.map((c, i) => (
                        <Box mt={2} key={i} display="flex" alignItems="center">
                            <Box width={100} height={100}>
                                <ImageOpt
                                    src={c.image?.image_name}
                                    objectFit="cover"
                                    layout="fill"
                                    width={100}
                                    height={100}
                                />
                            </Box>
                            <Box mr={2} ml={10} width="100%">
                                <Typography>{c.title}</Typography>
                            </Box>
                            <Box>
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
                            </Box>
                        </Box>
                    ))
                )}
                <Box mb={3} mt={3}>
                    <Divider />
                </Box>
                <Grid container spacing={10}>
                    <Grid item xs={6}>
                        <Box display="flex" flexDirection="column" width="100%">
                            <FormLabel
                                required={true}
                                style={{ marginBottom: "10px" }}
                                htmlFor="image"
                            >
                                Card image
                            </FormLabel>
                            <Button
                                variant="contained"
                                onClick={() => handleOpenMedia("image")}
                                color="primary"
                            >
                                open gallery
                            </Button>
                        </Box>
                        <Error errors={errors.image} />
                    </Grid>
                </Grid>
                <Box mt={3}>
                    <TextField
                        name="title"
                        label="Title"
                        size="small"
                        required={true}
                        value={cardInfo.title}
                        error={!!errors.title.length}
                        variant="outlined"
                        onChange={handleChange}
                        style={{ width: "100%" }}
                    />
                    <Error errors={errors.title} />
                </Box>
                <Box mb={3} mt={3}>
                    <Divider />
                </Box>
                {tmpQtys.map((q) => (
                    <Box
                        key={q.quantity_id}
                        mt={3}
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Box width="30%">
                            <Typography
                                style={{ textAlign: "center", fontWeight: 500 }}
                            >
                                Quantity: {q.qty}
                            </Typography>
                        </Box>
                        <Box mr={2} ml={2} width="70%">
                            <TextField
                                name="price"
                                label="Price"
                                required={true}
                                size="small"
                                value={q.price}
                                variant="outlined"
                                onChange={(e) => handlePrice(e, q.quantity_id)}
                                fullWidth
                            />
                        </Box>
                    </Box>
                ))}
                <Box width="100%" mt={3}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        id="showcase"
                        onClick={handleAdd}
                        style={{
                            height: "100%",
                            width: "100%",
                        }}
                        color="secondary"
                    >
                        add
                    </Button>
                </Box>
            </Box>
            {isImage && (
                <ImagePicker
                    state={cardInfo}
                    setState={setCardInfo}
                    fieldName="image"
                    close={() => handleCloseMedia("image")}
                    type="single"
                />
            )}
        </>
    );
};

export default CardForm;

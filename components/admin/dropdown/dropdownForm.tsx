import { Box, Typography, Divider, TextField, Button } from "@material-ui/core";
import { useState, useEffect } from "react";
import { IQuantity } from "../../../types/quantity";

// components
import Error from "../error";

// icons
import AddIcon from "@material-ui/icons/Add";
import { ICustomization } from "../../../types/customization";
import DeleteIcon from "@material-ui/icons/Delete";

interface IProps {
    quantities: IQuantity[];
    state: any;
    setState: any;
    optionId: string;
}

interface IError {
    title: string[];
}

const DropdownForm = ({ quantities, state, setState, optionId }: IProps) => {
    const [tmpQtys, setTmpQtys] = useState<IQuantity[]>([]);
    const [customization, setCustomization] =
        useState<ICustomization | null>(null);
    const [errors, setErrors] = useState<IError>({
        title: [],
    });
    const [dropdownInfo, setDropdownInfo] = useState({
        title: "",
    });

    useEffect(() => {
        setCustomization(
            state.customizations.find(
                (c: ICustomization) => c.option?.option_id === optionId
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

        setTmpQtys(() => {
            const tmpCust: ICustomization[] = [];
            for (let c of state.customizations) {
                const tmpDropdown: any = [];
                for (let dropdown of c.dropdown) {
                    tmpDropdown.push({
                        ...dropdown,
                        prices: quantities.map((q) => {
                            const dQty = dropdown.prices.find(
                                (qty) => qty.quantity_id === q.quantity_id
                            );

                            if (dQty) return dQty;

                            const foundQty = tmpQtys.find(
                                (qty) => qty.quantity_id === q.quantity_id
                            );

                            if (foundQty)
                                return { ...q, price: foundQty.price };
                            return { ...q, price: 0 };
                        }),
                    });
                }

                tmpCust.push({ ...c, dropdown: tmpDropdown });
            }

            setState({ ...state, customizations: tmpCust });

            return tmpTmpQtys;
        });
    }, [quantities]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDropdownInfo({ ...dropdownInfo, [e.target.name]: e.target.value });
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

        const dropdown = {
            ...dropdownInfo,
            prices: tmpQtys,
        };

        setState({
            ...state,
            customizations: state.customizations.map((c: ICustomization) =>
                c.option?.option_id === optionId
                    ? { ...c, dropdown: [...c.dropdown, dropdown] }
                    : c
            ),
        });

        setDropdownInfo({
            ...dropdownInfo,
            title: "",
        });

        setTmpQtys(quantities.map((q) => ({ ...q, price: 0 })));
    };

    const handleRemove = (i) => {
        setState({
            ...state,
            customizations: state.customizations.map((c: ICustomization) =>
                c.option?.option_id === optionId
                    ? {
                          ...c,
                          dropdown: c.dropdown.filter(
                              (dropdown, index) => index !== i
                          ),
                      }
                    : c
            ),
        });
    };

    const handleValidate = () => {
        const TmpErrors: IError = {
            title: [],
        };

        if (!dropdownInfo.title) {
            TmpErrors.title.push("Please fill in title.");
        }

        setErrors({ ...errors, ...TmpErrors });

        return TmpErrors;
    };

    return (
        <>
            <Box display="flex" flexDirection="column">
                {!customization?.dropdown.length ? (
                    <Box>
                        <Typography>No dropdown added.</Typography>
                    </Box>
                ) : (
                    customization?.dropdown.map((d, i) => (
                        <Box mt={2} key={i} display="flex" alignItems="center">
                            <Box mr={2} width="100%">
                                <Typography>{d.title}</Typography>
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
                <Box>
                    <TextField
                        name="title"
                        label="Title"
                        size="small"
                        required={true}
                        value={dropdownInfo.title}
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
        </>
    );
};

export default DropdownForm;

import { Box, Typography, Divider, TextField, Button } from "@material-ui/core";
import { useState, useEffect } from "react";
import { IQuantity } from "../../../types/quantity";
import { ICustomization } from "../../../types/customization";

// components
import Modal from "../modal";
import Error from "../error";

// icons
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import DoneIcon from "@material-ui/icons/Done";
import { IDropdown } from "../../../types/dropdown";

interface IError {
    title: string[];
}

const DropdownList = ({ quantities, state, setState, optionId }) => {
    const [isEdit, setEdit] = useState<any>(null);
    const [customization, setCustomization] =
        useState<ICustomization | null>(null);

    useEffect(() => {
        setCustomization(
            state.customizations.find(
                (c: ICustomization) => c.option?.option_id === optionId
            ) || null
        );
    }, [state.customizations]);

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

    const handleEdit = (id: string) => {
        const card = customization.dropdown.find((d) => d.dropdown_id === id);

        if (card) setEdit(card);
    };

    const handleCloseEdit = () => {
        setEdit(null);
    };

    return (
        <>
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
                        <Box mr={1}>
                            <Button
                                variant="contained"
                                startIcon={<EditIcon />}
                                color="primary"
                                onClick={() => handleEdit(d.dropdown_id)}
                            >
                                edit
                            </Button>
                        </Box>
                        <Box>
                            <Button
                                variant="contained"
                                startIcon={<DeleteIcon />}
                                style={{
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
            <Box mt={2}>
                <DropdownForm
                    setState={setState}
                    state={state}
                    optionId={optionId}
                    quantities={quantities}
                />
            </Box>
            {isEdit && (
                <Modal
                    type="child"
                    closeInfo={{ close: handleCloseEdit, check: true }}
                >
                    <DropdownForm
                        setState={setState}
                        close={handleCloseEdit}
                        state={state}
                        optionId={optionId}
                        quantities={quantities}
                        dropdown={isEdit}
                    />
                </Modal>
            )}
        </>
    );
};

interface IProps {
    setState: any;
    state: any;
    optionId: any;
    quantities: any;
    close?: any;
    dropdown?: IDropdown;
}

const DropdownForm = ({
    setState,
    state,
    optionId,
    quantities,
    dropdown,
    close,
}: IProps) => {
    const [tmpQtys, setTmpQtys] = useState<IQuantity[]>([]);
    useState<ICustomization | null>(null);
    const [errors, setErrors] = useState<IError>({
        title: [],
    });
    const [dropdownInfo, setDropdownInfo] = useState({
        title: "",
    });

    useEffect(() => {
        if (dropdown) {
            setDropdownInfo({
                ...dropdownInfo,
                title: dropdown.title,
            });
        }
    }, []);

    useEffect(() => {
        if (dropdown) {
            setTmpQtys(dropdown.prices as any);
        } else {
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
        }
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

        const tmpDropdown = {
            ...dropdownInfo,
            dropdown_id: Date.now(),
            prices: tmpQtys,
        };

        if (dropdown) {
            setState({
                ...state,
                customizations: state.customizations.map((c: ICustomization) =>
                    c.option?.option_id === optionId
                        ? {
                              ...c,
                              dropdown: c.dropdown.map((d) =>
                                  d.dropdown_id === dropdown.dropdown_id
                                      ? tmpDropdown
                                      : d
                              ),
                          }
                        : c
                ),
            });

            close();
        } else {
            setState({
                ...state,
                customizations: state.customizations.map((c: ICustomization) =>
                    c.option?.option_id === optionId
                        ? { ...c, dropdown: [...c.dropdown, tmpDropdown] }
                        : c
                ),
            });

            setDropdownInfo({
                ...dropdownInfo,
                title: "",
            });

            setTmpQtys(quantities.map((q) => ({ ...q, price: 0 })));
        }
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
                        startIcon={dropdown ? <DoneIcon /> : <AddIcon />}
                        id="showcase"
                        onClick={handleAdd}
                        style={{
                            height: "100%",
                            width: "100%",
                        }}
                        color="secondary"
                    >
                        {dropdown ? "save" : "add"}
                    </Button>
                </Box>
            </Box>
        </>
    );
};

export default DropdownList;

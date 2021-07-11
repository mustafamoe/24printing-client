import {
    Typography,
    Button,
    Box,
    CircularProgress,
    TextField,
} from "@material-ui/core";
import { apiCall } from "../../utils/apiCall";
import useSWR, { mutate } from "swr";
import { useEffect, useState } from "react";
import { RootReducer } from "../../store/reducers";
import { useSelector } from "react-redux";

// components
import HeadLayout from "../../components/headLayout";
import AdminLayout from "../../components/admin/adminLayout";
import Error from "../../components/admin/error";

interface IState {
    url: string;
}

interface IError {
    url: string[];
}

const Youtube = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const user = useSelector((state: RootReducer) => state.auth.user);
    const { data: yt } = useSWR("/youtube");
    const [state, setState] = useState<IState>({
        url: "",
    });
    const [errors, setErrors] = useState<IError>({
        url: [],
    });
    console.log(yt);
    useEffect(() => {
        if (yt) {
            setState({ ...state, url: yt.url });
        }
    }, [yt]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!loading) {
            const errors = handleValidate();

            for (let e of Object.values(errors)) {
                if (e.length) return;
            }

            try {
                if (!yt) {
                    await apiCall(
                        "post",
                        `/youtube?authId=${user.user_id}`,
                        state
                    );
                } else {
                    await apiCall(
                        "put",
                        `/youtube?authId=${user.user_id}`,
                        state
                    );
                }

                // try {
                //     if (!advCard) {
                //         setLoading(true);
                //         const advCard = await apiCall(
                //             "post",
                //             `/adv_card?authId=${user.user_id}`,
                //             state
                //         );

                //         mutate(
                //             "/adv_cards",
                //             (advCards) => {
                //                 return [...advCards, advCard];
                //             },
                //             false
                //         );
                //     } else {
                //         setLoading(true);
                //         const editedAdvCard = await apiCall(
                //             "put",
                //             `/adv_card/${advCard.adv_card_id}?authId=${user.user_id}`,
                //             state
                //         );

                //         mutate(
                //             "/adv_cards",
                //             (advCards) => {
                //                 return advCards.map((ac) =>
                //                     ac.adv_card_id !== advCard.adv_card_id
                //                         ? ac
                //                         : editedAdvCard
                //                 );
                //             },
                //             false
                //         );
                //     }
            } catch (err) {
                setLoading(false);
                setErrors({ ...errors, ...err });
            }
        }
    };

    const handleValidate = () => {
        const TmpErrors: IError = {
            url: [],
        };

        if (!state.url) {
            TmpErrors.url.push("Please fill in url.");
        }

        setErrors({ ...errors, ...TmpErrors });

        return TmpErrors;
    };

    return (
        <>
            <HeadLayout title="Admin youtube" />
            <AdminLayout access="is_admin">
                <div style={{ width: "100%" }}>
                    <Box display="flex" flexDirection="column">
                        <Box display="flex" flexDirection="row">
                            <Box flexGrow={1} style={{ marginBottom: "30px" }}>
                                <Typography variant="h5">
                                    Youtube links management
                                </Typography>
                            </Box>
                        </Box>
                        <div>
                            <form onSubmit={handleSubmit}>
                                <Box mb={3}>
                                    <TextField
                                        name="url"
                                        label="Url"
                                        size="small"
                                        value={state.url}
                                        variant="outlined"
                                        onChange={handleChange}
                                        style={{ width: "100%" }}
                                    />
                                    <Error errors={errors.url} />
                                </Box>
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
                            </form>
                        </div>
                    </Box>
                </div>
            </AdminLayout>
        </>
    );
};

export default Youtube;

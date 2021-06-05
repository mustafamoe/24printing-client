import { useEffect, useState } from "react";
import {
    FormGroup,
    FormLabel,
    Button,
    Box,
    CircularProgress,
} from "@material-ui/core";
import { apiCall } from "../../../utils/apiCall";
import useSWR, { mutate } from "swr";
import { RootReducer } from "../../../store/reducers";
import { useSelector } from "react-redux";
import TextEditor from "../textEditor";

// components
import Error from "../error";
import { IPrivacyPolicy } from "../../../types/privacyPolicy";

interface IState {
    content: string;
}

interface IError {
    content: string[];
}

const PrivacyPolicyForm = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const { data: privacyPolicy } = useSWR<IPrivacyPolicy>("/privacy_policy");
    const user = useSelector((state: RootReducer) => state.auth.user);
    const [state, setState] = useState<IState>({
        content: "",
    });
    const [errors, setErrors] = useState<IError>({
        content: [],
    });

    useEffect(() => {
        if (privacyPolicy) {
            setState({
                ...state,
                content: privacyPolicy.content || "",
            });
        }
    }, [privacyPolicy]);

    const handleEditorChange = (e: any, name: string): void => {
        setState({ ...state, [name]: e });
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
                const editedPrivacyPolicy = await apiCall(
                    "put",
                    `/privacy_policy?authId=${user.user_id}`,
                    state
                );

                mutate("/privacy_policy", () => editedPrivacyPolicy, false);
                setLoading(false);
            } catch (err) {
                setLoading(false);
                setErrors({ ...errors, ...err });
            }
        }
    };

    const handleValidate = () => {
        const TmpErrors: IError = {
            content: [],
        };

        if (!state.content) {
            TmpErrors.content.push("Please fill in privacy policy content.");
        }

        setErrors({ ...errors, ...TmpErrors });

        return TmpErrors;
    };

    return (
        <>
            <form onSubmit={handleSubmit} noValidate autoComplete="off">
                <div>
                    <FormGroup style={{ margin: "30px 0" }}>
                        <FormLabel
                            style={{ marginBottom: "10px" }}
                            required={true}
                            htmlFor="content"
                        >
                            Privacy policy content
                        </FormLabel>
                        <TextEditor
                            id="content"
                            name="content"
                            value={state.content}
                            onChange={handleEditorChange}
                        />
                        <Error errors={errors.content} />
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
                                <CircularProgress style={{ color: "white" }} />
                            ) : (
                                "Submit"
                            )}
                        </Button>
                    </Box>
                </div>
            </form>
        </>
    );
};

export default PrivacyPolicyForm;

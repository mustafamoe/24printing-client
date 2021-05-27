import { useState, useEffect } from "react";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { Button, Box, CircularProgress } from "@material-ui/core";
import { IUser } from "../../../types/user";
import { apiCall } from "../../../utils/apiCall";
import { RootReducer } from "../../../store/reducers";
import { useSelector } from "react-redux";
import { mutate } from "swr";

// components
import Modal from "../modal";

interface IError {}

interface IProps {
    user: IUser;
    close: any;
}

const UserForm = ({ close, user }: IProps) => {
    const [state, setState] = useState({
        is_customer_service: false,
        is_accountant: false,
    });
    const userId = useSelector((state: RootReducer) => state.auth.user.user_id);
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<IError>({});

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };

    useEffect(() => {
        if (user) {
            setState({
                ...state,
                is_customer_service: user.is_customer_service || false,
                is_accountant: user.is_accountant || false,
            });
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!loading) {
            // const errors = handleValidate();

            // for (let e of Object.values(errors)) {
            //     if (e.length) return;
            // }

            try {
                setLoading(true);
                if (!user) {
                    // setLoading(true);
                    // const user = await apiCall(
                    //     "post",
                    //     `/user/${}?authId=${user.user_id}`,
                    //     state
                    // );
                    // mutate(
                    //     "/users",
                    //     (users) => {
                    //         return [...users, user];
                    //     },
                    //     false
                    // );
                } else {
                    await apiCall(
                        "put",
                        `/user/${user.user_id}/user_role?authId=${userId}`,
                        state
                    );

                    mutate(
                        `/users?authId=${userId}`,
                        (users: IUser[]) => {
                            return users.map((u) =>
                                u.user_id === user.user_id
                                    ? {
                                          ...u,
                                          is_accountant: state.is_accountant,
                                          is_customer_service:
                                              state.is_customer_service,
                                      }
                                    : u
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
        // const TmpErrors: IError = {
        //     user_name: [],
        // };
        // const handleValidate = () => {
        //     const TmpErrors: IError = {
        //         user_name: [],
        //     };
        //     if (!state.user_name) {
        //         TmpErrors.user_name.push("Please fill in user name.");
        //     }
        //     setErrors({ ...errors, ...TmpErrors });
        //     return TmpErrors;
    };

    return (
        <Modal width={30} type="parent" closeInfo={{ close, check: true }}>
            <form onSubmit={handleSubmit}>
                <Box flexDirection="column" display="flex" width="100%">
                    <FormControl component="fieldset">
                        <FormLabel component="legend">User roles</FormLabel>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={state.is_customer_service}
                                        onChange={handleChange}
                                        name="is_customer_service"
                                    />
                                }
                                label="Customer service"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={state.is_accountant}
                                        onChange={handleChange}
                                        name="is_accountant"
                                    />
                                }
                                label="Accountant"
                            />
                        </FormGroup>
                    </FormControl>
                    <Box mt={2}>
                        <Button
                            fullWidth
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
                </Box>
            </form>
        </Modal>
    );
};

export default UserForm;

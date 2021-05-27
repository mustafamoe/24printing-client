import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootReducer } from "../../store/reducers";
import { apiCall } from "../../utils/apiCall";
import { editProfileSuccess } from "../../store/actions/user";

// components
import Loader from "../loader";
import Modal from "../modal";
import ImagePicker from "../userImage/imagePicker";
import Error from "../admin/error";
import { IUser } from "../../types/user";

interface IError {
    avatar: string[];
    first_name: string[];
    last_name: string[];
    phone: string[];
}

const ProfileForm = ({ close }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const user = useSelector((state: RootReducer) => state.auth.user);
    const [errors, setErrors] = useState<IError>({
        avatar: [],
        first_name: [],
        last_name: [],
        phone: [],
    });
    const [avatartInput, setAvatarInput] = useState(false);
    const [state, setState] = useState({
        first_name: "",
        last_name: "",
        phone: "",
        avatar: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = handleValidate();

        for (let e of Object.values(errors)) {
            if (e.length) return;
        }

        try {
            setLoading(true);

            const editedUser = await apiCall<IUser>(
                "put",
                `/profile?authId=${user.user_id}`,
                state
            );

            dispatch(editProfileSuccess(editedUser));

            setLoading(false);
            close();
        } catch (err) {
            setLoading(false);
            setErrors({ ...errors, ...err });
        }
    };

    const handleValidate = () => {
        const TmpErrors: IError = {
            avatar: [],
            first_name: [],
            last_name: [],
            phone: [],
        };

        if (!state.avatar) {
            TmpErrors.avatar.push("Please fill in avatar.");
        }

        if (!state.first_name) {
            TmpErrors.first_name.push("Please fill in line 2.");
        }

        if (!state.last_name) {
            TmpErrors.last_name.push("Please fill in city.");
        }

        if (!state.phone) {
            TmpErrors.phone.push("Please fill in zip code.");
        }

        setErrors({ ...errors, ...TmpErrors });

        return TmpErrors;
    };

    const toggleAvatarInput = () => {
        if (avatartInput) {
            setAvatarInput(false);
        } else {
            setAvatarInput(true);
        }
    };

    useEffect(() => {
        if (user) {
            setState({
                ...state,
                first_name: user.first_name,
                last_name: user.last_name,
                phone: user.phone,
                avatar: user.avatar ? user.avatar.image_id : "",
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    const buttonJsx = () => {
        const button = (
            <button type="submit" className="button submit-btn">
                save changes
            </button>
        );

        if (loading) return <Loader />;
        return button;
    };

    return (
        <>
            <Modal close={close}>
                <form onSubmit={handleSubmit}>
                    <div className="form-input-container">
                        <label className="form-label" htmlFor="avatar">
                            profile picture
                        </label>
                        <button
                            type="button"
                            className="button"
                            onClick={toggleAvatarInput}
                        >
                            open gallery
                        </button>
                        <Error errors={errors.avatar} />
                    </div>
                    <div className="form-input-container">
                        <label className="form-label" htmlFor="first_name">
                            first name
                        </label>
                        <input
                            type="text"
                            id="first_name"
                            name="first_name"
                            className="form-input"
                            placeholder="first name"
                            value={state.first_name}
                            onChange={handleChange}
                        />
                        <Error errors={errors.first_name} />
                    </div>
                    <div className="form-input-container">
                        <label className="form-label" htmlFor="last_name">
                            last name
                        </label>
                        <input
                            type="text"
                            id="last_name"
                            name="last_name"
                            className="form-input"
                            placeholder="last name"
                            value={state.last_name}
                            onChange={handleChange}
                        />
                        <Error errors={errors.last_name} />
                    </div>
                    <div className="form-input-container">
                        <label className="form-label" htmlFor="phone">
                            phone number
                        </label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            className="form-input"
                            placeholder="phone number"
                            value={state.phone}
                            onChange={handleChange}
                        />
                        <Error errors={errors.phone} />
                    </div>
                    <div className="form-input-container">{buttonJsx()}</div>
                </form>
            </Modal>
            {avatartInput && (
                <ImagePicker
                    close={toggleAvatarInput}
                    state={state}
                    setState={setState}
                    type="single"
                    fieldName="avatar"
                />
            )}
        </>
    );
};

export default ProfileForm;

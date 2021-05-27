import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootReducer } from "../../store/reducers";
import { IAddress } from "../../types/address";
import { mutate } from "swr";
import { apiCall } from "../../utils/apiCall";

// components
import Modal from "../modal";
import Loader from "../loader";
import Error from "../admin/error";

interface IError {
    line_1: string[];
    line_2: string[];
    city: string[];
    zip_code: string[];
}

interface IProps {
    close: any;
    address?: IAddress;
}

interface IState {
    line_1: string;
    line_2: string;
    city: string;
    zip_code: number | null;
}

const AddressForm = ({ close, address }: IProps) => {
    const user = useSelector((state: RootReducer) => state.auth.user);
    const [addLoading, setAddLoading] = useState(false);
    const [errors, setErrors] = useState<IError>({
        line_1: [],
        line_2: [],
        city: [],
        zip_code: [],
    });
    const [editLoading, setEditLoading] = useState(false);
    const [state, setState] = useState<IState>({
        line_1: "",
        line_2: "",
        city: "",
        zip_code: null,
    });

    useEffect(() => {
        if (address) {
            setState({
                ...state,
                line_1: address.line_1,
                line_2: address.line_2,
                city: address.city,
                zip_code: address.zip_code,
            });
        }
    }, []);

    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = handleValidate();

        for (let e of Object.values(errors)) {
            if (e.length) return;
        }

        if (!address) {
            try {
                setAddLoading(true);

                const address = await apiCall<IAddress>(
                    "post",
                    `/address?authId=${user.user_id}`,
                    state
                );

                mutate(
                    `/addresses?authId=${user.user_id}`,
                    (addresses: IAddress[]) => {
                        return [...addresses, address];
                    }
                );

                setAddLoading(false);
                close();
            } catch (err) {
                setAddLoading(false);
                setErrors({ ...errors, ...err });
            }
        } else {
            try {
                setEditLoading(true);

                const editedAddress = await apiCall<IAddress>(
                    "put",
                    `/address/${address.address_id}?authId=${user.user_id}`,
                    state
                );

                mutate(
                    `/addresses?authId=${user.user_id}`,
                    (addresses: IAddress[]) => {
                        return addresses.map((a) =>
                            a.address_id === address.address_id
                                ? editedAddress
                                : a
                        );
                    }
                );

                setEditLoading(false);
                close();
            } catch (err) {
                setEditLoading(false);
                setErrors({ ...errors, ...err });
            }
        }
    };

    const handleValidate = () => {
        const TmpErrors: IError = {
            line_1: [],
            line_2: [],
            city: [],
            zip_code: [],
        };

        if (!state.line_1) {
            TmpErrors.line_1.push("Please fill in line 1.");
        }

        if (!state.line_2) {
            TmpErrors.line_2.push("Please fill in line 2.");
        }

        if (!state.city) {
            TmpErrors.city.push("Please fill in city.");
        }

        if (!state.zip_code) {
            TmpErrors.zip_code.push("Please fill in zip code.");
        }

        setErrors({ ...errors, ...TmpErrors });

        return TmpErrors;
    };

    const buttonJsx = () => {
        const button = (
            <button type="submit" className="button submit-btn">
                {!address ? "add address" : "save changes"}
            </button>
        );
        if (!address) {
            if (addLoading) return <Loader />;
            return button;
        }

        if (editLoading) return <Loader />;
        return button;
    };

    return (
        <Modal close={close}>
            <div>
                <form onSubmit={handleSubmit}>
                    <div className="form-input-container">
                        <label className="form-label">Line 1</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="line 1"
                            name="line_1"
                            value={state.line_1}
                            onChange={handleChange}
                        />
                        <Error errors={errors.line_1} />
                    </div>
                    <div className="form-input-container">
                        <label className="form-label">Line 2</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="line 2"
                            name="line_2"
                            value={state.line_2}
                            onChange={handleChange}
                        />
                        <Error errors={errors.line_2} />
                    </div>
                    <div className="form-input-container">
                        <label className="form-label">City</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="city"
                            name="city"
                            value={state.city}
                            onChange={handleChange}
                        />
                        <Error errors={errors.city} />
                    </div>
                    <div className="form-input-container">
                        <label className="form-label">zip/postal code</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="zip_code"
                            name="zip_code"
                            value={state.zip_code}
                            onChange={handleChange}
                        />
                        <Error errors={errors.zip_code} />
                    </div>
                    <div>{buttonJsx()}</div>
                </form>
            </div>
        </Modal>
    );
};

export default AddressForm;

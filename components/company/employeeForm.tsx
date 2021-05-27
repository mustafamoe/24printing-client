import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootReducer } from "../../store/reducers";
import { mutate } from "swr";
import { apiCall } from "../../utils/apiCall";

// components
import Modal from "../modal";
import Error from "../admin/error";

interface IError {
    email: string[];
}

interface IProps {
    close: any;
    companyId: string;
}

const EmployeeForm = ({ close, companyId }: IProps) => {
    const { user_id } = useSelector((state: RootReducer) => state.auth.user);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        email: [],
    });
    const [state, setState] = useState({
        email: "",
    });

    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = handleValidate();

        for (let e of Object.values(errors)) {
            if (e.length) return;
        }

        try {
            setLoading(true);

            const user = await apiCall(
                "post",
                `/add_employee/${companyId}?authId=${user_id}&user_email=${state.email}`
            );

            setLoading(false);
        } catch (err) {
            setErrors({ ...errors, ...err });
            setLoading(false);
        }
    };

    const handleValidate = () => {
        const TmpErrors: IError = {
            email: [],
        };

        if (!state.email) {
            TmpErrors.email.push("Please fill in email.");
        }

        setErrors({ ...errors, ...TmpErrors });

        return TmpErrors;
    };

    return (
        <Modal close={close}>
            <form onSubmit={handleSubmit}>
                <div className="form-input-container">
                    <label htmlFor="email" className="form-label">
                        email
                    </label>
                    <input
                        type="text"
                        id="email"
                        className="form-input"
                        placeholder="email"
                        name="email"
                        value={state.email}
                        onChange={handleChange}
                    />
                    <Error errors={errors.email} />
                </div>
                <div className="form-input-container">
                    <button type="submit" className="button">
                        {loading ? "loading..." : "add user"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default EmployeeForm;

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ICompany } from "../../types/company";
import { RootReducer } from "../../store/reducers";
import { mutate } from "swr";
import { apiCall } from "../../utils/apiCall";

// components
import Modal from "../modal";
import Loader from "../loader";
import Error from "../admin/error";

interface IError {
    company_name: string[];
    trade_license: string[];
    company_tel_number: string[];
    fax_number: string[];
    company_email: string[];
    contact_email: string[];
    website: string[];
    contact_name: string[];
    contact_direct_number: string[];
    contact_mobile_number: string[];
}

interface IProps {
    close: any;
    company?: ICompany;
}

interface IState {
    company_name: string;
    trade_license: string;
    company_tel_number: number | null;
    fax_number: number | null;
    company_email: string;
    website: string;
    contact_name: string;
    contact_email: string;
    contact_direct_number: number | null;
    contact_mobile_number: number | null;
}

const CompanyForm = ({ close, company }: IProps) => {
    const user = useSelector((state: RootReducer) => state.auth.user);
    const [addLoading, setAddLoading] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [errors, setErrors] = useState<IError>({
        company_name: [],
        trade_license: [],
        contact_email: [],
        company_email: [],
        company_tel_number: [],
        fax_number: [],
        website: [],
        contact_name: [],
        contact_direct_number: [],
        contact_mobile_number: [],
    });
    const [state, setState] = useState<IState>({
        company_name: "",
        trade_license: "",
        company_email: "",
        contact_email: "",
        company_tel_number: null,
        fax_number: null,
        website: "",
        contact_name: "",
        contact_direct_number: null,
        contact_mobile_number: null,
    });

    useEffect(() => {
        if (company) {
            setState({
                ...state,
                company_name: company.company_name,
                trade_license: company.trade_license,
                company_tel_number: company.company_tel_number,
                fax_number: company.fax_number,
                company_email: company.company_email,
                website: company.website,
                contact_name: company.contact_name,
                contact_direct_number: company.contact_direct_number,
                contact_mobile_number: company.contact_mobile_number,
                contact_email: company.contact_email,
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

        if (!company) {
            try {
                setAddLoading(true);

                const company = await apiCall<ICompany>(
                    "post",
                    `/company?authId=${user.user_id}`,
                    state
                );

                mutate(
                    `/companies?authId=${user.user_id}`,
                    (companies: ICompany[]) => {
                        return [...companies, company];
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

                const editedAddress = await apiCall<ICompany>(
                    "put",
                    `/company/${company.company_id}?authId=${user.user_id}`,
                    state
                );

                mutate(
                    `/companies?authId=${user.user_id}`,
                    (companies: ICompany[]) => {
                        return companies.map((a) =>
                            a.company_id === company.company_id
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
            company_name: [],
            trade_license: [],
            contact_email: [],
            company_email: [],
            company_tel_number: [],
            fax_number: [],
            website: [],
            contact_name: [],
            contact_direct_number: [],
            contact_mobile_number: [],
        };

        if (!state.company_name) {
            TmpErrors.company_name.push("Please fill in company name.");
        }

        if (!state.trade_license) {
            TmpErrors.trade_license.push("Please fill in trade license.");
        }

        if (!state.contact_email) {
            TmpErrors.contact_email.push("Please fill in contact email.");
        }

        if (!state.company_email) {
            TmpErrors.company_email.push("Please fill in company email.");
        }

        if (!state.company_tel_number) {
            TmpErrors.company_tel_number.push("Please fill in tel number.");
        }
        if (!state.fax_number) {
            TmpErrors.fax_number.push("Please fill in fax number.");
        }
        if (!state.website) {
            TmpErrors.website.push("Please fill in website.");
        }

        if (!state.contact_name) {
            TmpErrors.contact_name.push("Please fill in contact name.");
        }

        if (!state.contact_direct_number) {
            TmpErrors.contact_direct_number.push(
                "Please fill in contact direct number."
            );
        }

        if (!state.contact_mobile_number) {
            TmpErrors.contact_mobile_number.push(
                "Please fill in contact mobile number."
            );
        }

        setErrors({ ...errors, ...TmpErrors });

        return TmpErrors;
    };

    const buttonJsx = () => {
        const button = (
            <button type="submit" className="button submit-btn">
                {!company ? "add company" : "save changes"}
            </button>
        );
        if (!company) {
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
                        <label className="form-label">company name</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="name"
                            name="company_name"
                            value={state.company_name}
                            onChange={handleChange}
                        />
                        <Error errors={errors.company_name} />
                    </div>
                    <div className="form-input-container">
                        <label className="form-label">trade license</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="trade license"
                            name="trade_license"
                            value={state.trade_license}
                            onChange={handleChange}
                        />
                        <Error errors={errors.trade_license} />
                    </div>
                    <div className="form-input-container">
                        <label className="form-label">tel number</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="company tel number"
                            name="company_tel_number"
                            value={state.company_tel_number}
                            onChange={handleChange}
                        />
                        <Error errors={errors.company_tel_number} />
                    </div>
                    <div className="form-input-container">
                        <label className="form-label">fax number</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="fax number"
                            name="fax_number"
                            value={state.fax_number}
                            onChange={handleChange}
                        />
                        <Error errors={errors.fax_number} />
                    </div>
                    <div className="form-input-container">
                        <label className="form-label">company email</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="company email"
                            name="company_email"
                            value={state.company_email}
                            onChange={handleChange}
                        />
                        <Error errors={errors.company_email} />
                    </div>
                    <div className="form-input-container">
                        <label className="form-label">website</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="website"
                            name="website"
                            value={state.website}
                            onChange={handleChange}
                        />
                        <Error errors={errors.website} />
                    </div>
                    <div className="form-input-container">
                        <label className="form-label">contact name</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="contact name"
                            name="contact_name"
                            value={state.contact_name}
                            onChange={handleChange}
                        />
                        <Error errors={errors.contact_name} />
                    </div>
                    <div className="form-input-container">
                        <label className="form-label">
                            contact direct number
                        </label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="contact direct number"
                            name="contact_direct_number"
                            value={state.contact_direct_number}
                            onChange={handleChange}
                        />
                        <Error errors={errors.contact_direct_number} />
                    </div>
                    <div className="form-input-container">
                        <label className="form-label">
                            contact mobile number
                        </label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="contact mobile number"
                            name="contact_mobile_number"
                            value={state.contact_mobile_number}
                            onChange={handleChange}
                        />
                        <Error errors={errors.contact_mobile_number} />
                    </div>
                    <div className="form-input-container">
                        <label className="form-label">contact email</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="email"
                            name="contact_email"
                            value={state.contact_email}
                            onChange={handleChange}
                        />
                        <Error errors={errors.contact_email} />
                    </div>
                    <div>{buttonJsx()}</div>
                </form>
            </div>
        </Modal>
    );
};

export default CompanyForm;

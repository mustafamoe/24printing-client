import { useState } from "react";
import { useSelector } from "react-redux";
import useSwr from "swr";
import { RootReducer } from "../../store/reducers";
import { ICompany } from "../../types/company";

// components
import Loader from "../loader";
import CompanyItem from "./companyItem";
import CompanyForm from "./companyForm";
import EmployeeForm from "./employeeForm";

const CompanyList = () => {
    const user = useSelector((state: RootReducer) => state.auth.user);
    const { data: companies } = useSwr<ICompany[]>(
        `/companies?authId=${user.user_id}`
    );
    const [showCompanyForm, setCompanyForm] = useState(false);
    const [userToCompany, setUserToCompany] = useState(null);
    const [editCompany, setEditCompany] = useState(null);

    const toggleCompanyForm = () => {
        if (showCompanyForm) {
            document.body.style.overflow = "auto";
            setCompanyForm(false);
        } else {
            document.body.style.overflow = "hidden";
            setCompanyForm(true);
        }
    };

    const toggleUserToCompany = (companyId) => {
        if (userToCompany) {
            document.body.style.overflow = "auto";
            setUserToCompany(null);
        } else {
            document.body.style.overflow = "hidden";
            setUserToCompany(companyId);
        }
    };

    const toggleEditCompany = (company) => {
        if (editCompany) {
            document.body.style.overflow = "auto";
            setEditCompany(null);
        } else {
            document.body.style.overflow = "hidden";
            setEditCompany(company);
        }
    };

    return (
        <>
            <div className="profile-content-item">
                <div className="profile-heading-container">
                    <p className="profile-heading">companies</p>
                    <div>
                        <button
                            type="button"
                            className="button"
                            onClick={toggleCompanyForm}
                        >
                            add
                        </button>
                    </div>
                </div>
                {!companies ? (
                    <div>
                        <Loader />
                    </div>
                ) : !companies.length ? (
                    <div>
                        <p>you don't have any companies yet.</p>
                    </div>
                ) : (
                    <div>
                        <div className="address-head-item">
                            <div className="address-content-item-head">
                                <p className="address-content-head-text">
                                    name
                                </p>
                            </div>
                            <div className="address-content-item-head">
                                <p className="address-content-head-text">
                                    email
                                </p>
                            </div>
                            <div className="address-content-item-head">
                                <p className="address-content-head-text">
                                    Trade License
                                </p>
                            </div>
                            <div className="address-content-item-head">
                                <p className="address-content-head-text">
                                    website
                                </p>
                            </div>
                        </div>
                        {companies.map((company) => (
                            <CompanyItem
                                key={company.company_id}
                                toggleUserToCompany={toggleUserToCompany}
                                toggleEditCompany={toggleEditCompany}
                                user={user}
                                company={company}
                            />
                        ))}
                    </div>
                )}
            </div>
            {showCompanyForm && <CompanyForm close={toggleCompanyForm} />}
            {editCompany && (
                <CompanyForm company={editCompany} close={toggleEditCompany} />
            )}
            {userToCompany && (
                <EmployeeForm
                    companyId={userToCompany}
                    close={toggleUserToCompany}
                />
            )}
        </>
    );
};

export default CompanyList;

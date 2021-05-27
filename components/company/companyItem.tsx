import { useState } from "react";
import { ICompany } from "../../types/company";
import { IUser } from "../../types/user";
import { apiCall } from "../../utils/apiCall";
import { mutate } from "swr";

interface IProps {
    user: IUser;
    company: ICompany;
    toggleEditCompany?: any;
    toggleUserToCompany?: any;
}

const CompanyItem = ({
    user,
    company,
    toggleEditCompany,
    toggleUserToCompany,
}: IProps) => {
    const [isHover, setHover] = useState(false);

    const handleDelete = async () => {
        try {
            await apiCall(
                "delete",
                `/company/${company.company_id}?authId=${user.user_id}`
            );

            mutate(
                `/companies?authId=${user.user_id}`,
                (companies: ICompany[]) => {
                    return companies.filter(
                        (a) => a.company_id !== company.company_id
                    );
                }
            );
        } catch (err) {}
    };

    const handleDeleteUser = async (id) => {
        try {
            await apiCall(
                "post",
                `/remove_employee/${company.company_id}?authId=${user.user_id}&user_id=${id}`
            );

            mutate(
                `/companies?authId=${user.user_id}`,
                (companies: ICompany[]) => {
                    return companies.filter((c) =>
                        c.company_id === company.company_id
                            ? {
                                  ...c,
                                  employees: c.employees.filter(
                                      (e) => e.user_id !== id
                                  ),
                              }
                            : c
                    );
                }
            );
        } catch (err) {}
    };

    return (
        <div
            className="company-item"
            onMouseOver={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div className="company-content-wrapper">
                <div className="company-content-container">
                    <div className="company-content-item">
                        <p className="company-content-text">
                            {company.company_name}
                        </p>
                    </div>
                    <div className="company-content-item">
                        <p className="company-content-text">
                            {company.company_email}
                        </p>
                    </div>
                    <div className="company-content-item">
                        <p className="company-content-text">
                            {company.trade_license}
                        </p>
                    </div>
                    <div className="company-content-item">
                        <p className="company-content-text">
                            {company.website}
                        </p>
                    </div>
                </div>
                <div className="company-employees-container">
                    <div className="company-employees-heading-container">
                        <p className="company-employees-heading">users</p>
                        <div>
                            <button
                                type="button"
                                className="button"
                                onClick={() =>
                                    toggleUserToCompany(company.company_id)
                                }
                            >
                                add
                            </button>
                        </div>
                    </div>
                    {!company.employees.length ? (
                        <p>no users add yet.</p>
                    ) : (
                        <div>
                            {company.employees.map((e) => (
                                <div
                                    key={e.user_id}
                                    className="profile-employee-container"
                                >
                                    <div className="employee-content-contaienr">
                                        <div className="employee-content-item">
                                            <p>{e.email}</p>
                                        </div>
                                    </div>
                                    <div className="employee-controls">
                                        <button
                                            type="button"
                                            className="button delete-btn"
                                            onClick={() =>
                                                handleDeleteUser(e.user_id)
                                            }
                                        >
                                            remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div
                style={isHover ? { right: "10px" } : null}
                className="company-controls-container"
            >
                <button
                    style={{ marginRight: "10px" }}
                    type="button"
                    onClick={() => toggleEditCompany(company)}
                    className="button"
                >
                    edit
                </button>
                <button
                    type="button"
                    className="button delete-btn"
                    onClick={handleDelete}
                >
                    delete
                </button>
            </div>
        </div>
    );
};

export default CompanyItem;

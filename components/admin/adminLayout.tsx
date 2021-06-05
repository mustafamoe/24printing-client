import { Access } from "../../types/user";
import WithAdmin from "../../hocs/withAdmin";
import WithAccountant from "../../hocs/withAccountant";
import WithCustoemrService from "../../hocs/withCustomerService";
import WithAllAccess from "../../hocs/withAllAccess";

// components
import SideBar from "./sideBar";
import React from "react";

interface Props {
    children?: React.ReactNode;
    space?: boolean;
    access?: "all" | Access;
}

const AdminLayout = ({ children, space, access }: Props) => {
    if (access === "all")
        return (
            <WithAllAccess>
                <SideBar />
                <div
                    style={{
                        marginLeft: "240px",
                        padding: space ? "0px" : "50px",
                    }}
                >
                    {children}
                </div>
            </WithAllAccess>
        );
    else if (access === "is_admin")
        return (
            <WithAdmin>
                <SideBar />
                <div
                    style={{
                        marginLeft: "240px",
                        padding: space ? "0px" : "50px",
                    }}
                >
                    {children}
                </div>
            </WithAdmin>
        );
    else if (access === "is_accountant")
        return (
            <WithAccountant>
                <SideBar />
                <div
                    style={{
                        marginLeft: "240px",
                        padding: space ? "0px" : "50px",
                    }}
                >
                    {children}
                </div>
            </WithAccountant>
        );
    else if (access === "is_customer_service")
        return (
            <WithCustoemrService>
                <SideBar />
                <div
                    style={{
                        marginLeft: "240px",
                        padding: space ? "0px" : "50px",
                    }}
                >
                    {children}
                </div>
            </WithCustoemrService>
        );
    return null;

    // return (
    //         {Layout()}
    // );
};

export default AdminLayout;

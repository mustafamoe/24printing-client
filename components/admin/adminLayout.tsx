import { Access } from "../../types/user";
import WithAdmin from "../../hocs/withAdmin";
import WithAccountant from "../../hocs/withAccountant";
import WithCustoemrService from "../../hocs/withCustomerService";
import WithAllAccess from "../../hocs/withAllAccess";

// components
import SideBar from "./sideBar";

interface Props {
    children?: React.ReactNode;
    space?: boolean;
    access?: "all" | Access;
}

const AdminLayout = ({ children, space, access }: Props) => {
    const Layout = () => (
        <div>
            <SideBar />
            <div
                style={{
                    marginLeft: "240px",
                    padding: space ? "0px" : "50px",
                }}
            >
                {children}
            </div>
        </div>
    );

    if (access === "all")
        return (
            <WithAllAccess>
                <Layout />
            </WithAllAccess>
        );
    else if (access === "is_admin")
        return (
            <WithAdmin>
                <Layout />
            </WithAdmin>
        );
    else if (access === "is_accountant")
        return (
            <WithAccountant>
                <Layout />
            </WithAccountant>
        );
    else if (access === "is_customer_service")
        return (
            <WithCustoemrService>
                <Layout />
            </WithCustoemrService>
        );
    return null;
};

export default AdminLayout;

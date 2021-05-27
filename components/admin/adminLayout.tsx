// import Navbar from "./navbar";
// import Footer from "./footer";
import { useRouter } from "next/router";
import WithAdmin from "../../hocs/withAdmin";

// components
import SideBar from "./sideBar";

interface Props {
    children?: React.ReactNode;
    space?: boolean;
}

const AdminLayout = ({ children, space }: Props) => {
    return (
        <WithAdmin>
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
        </WithAdmin>
    );
};

export default AdminLayout;

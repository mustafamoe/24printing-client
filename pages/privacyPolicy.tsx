import parser from "html-react-parser";
import useSwr from "swr";
import { IPrivacyPolicy } from "../types/privacyPolicy";

// components
import Loader from "../components/loader";
import HeadLayout from "../components/headLayout";

const PrivacyPolicy = () => {
    const { data: privacyPolicy } = useSwr<IPrivacyPolicy>("/privacy_policy");

    if (!privacyPolicy)
        return (
            <div className="pp-loading-container">
                <Loader />
            </div>
        );
    return (
        <>
            <HeadLayout title="Privacy Policy" />
            <div className="privacy-policy-page">
                {parser(privacyPolicy.content)}
            </div>
        </>
    );
};

export default PrivacyPolicy;

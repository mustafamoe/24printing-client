import cookie from "cookie";
import { useSelector } from "react-redux";
import { RootReducer } from "../store/reducers";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

interface IProps {
    children: React.ReactNode;
}

const WithoutSignin = ({ children }: IProps) => {
    const router = useRouter();
    const [isWindow, setWindow] = useState(false);
    const [isAuth, setAuth] = useState(false);
    const {
        user,
        onload: { loading },
    } = useSelector((state: RootReducer) => state.auth);

    useEffect(() => {
        const { isAuth } = cookie.parse(document.cookie);

        setWindow(true);
        setAuth(isAuth);
    }, []);

    if (!isWindow) return <>{children}</>;
    else if (!isAuth) return <>{children}</>;
    else if (loading) return <p>loading...</p>;
    else if (user) {
        router.push("/");
        return null;
    } else return <>{children}</>;
};

export default WithoutSignin;

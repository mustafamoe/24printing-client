import { useState } from "react";
import { useSelector } from "react-redux";
import ImageOpt from "../components/imageOpt";
import WithSignin from "../hocs/withSignin";
import { RootReducer } from "../store/reducers";

// components
import AddressList from "../components/address/addressList";
import CompanyList from "../components/company/companyList";
import OrderList from "../components/order/orderList";
import ProfileForm from "../components/profile/profileForm";
import Loader from "../components/loader";
import useSwr, { mutate } from "swr";
import { IImage } from "../types/image";
import { apiCall } from "../utils/apiCall";
import HeadLayout from "../components/headLayout";

const Profile = () => {
    const user = useSelector((state: RootReducer) => state.auth.user);
    const [editProfile, setProfile] = useState(false);
    const { data: gallery } = useSwr<IImage[]>(
        user ? `/user_images?authId=${user?.user_id}` : null
    );
    const [columns, setColumns] = useState(3);
    const [state, setState] = useState({
        activeTab: "details",
    });

    const toggleProfileForm = () => {
        if (editProfile) {
            document.body.style.overflow = "auto";
            setProfile(false);
        } else {
            document.body.style.overflow = "hidden";
            setProfile(true);
        }
    };

    const handleChangeActiveTab = (tab) => {
        setState({ ...state, activeTab: tab });
    };

    const activeTabStyles = {
        backgroundColor: "#ec008c",
        color: "white",
    };

    const handleDeleteImage = async (imageName: string) => {
        try {
            await apiCall(
                "delete",
                `/user_image/${imageName}?authId=${user.user_id}`
            );

            mutate(
                `/user_images?authId=${user?.user_id}`,
                (images: IImage[]) => {
                    return images.filter((i) => i.image_name !== imageName);
                }
            );
        } catch (err) {}
    };

    const jsx = () => {
        const imagesCopy = [...gallery];
        const n = Math.ceil(imagesCopy.length / columns);
        let result = [];

        for (let i = 0; i < columns; i++) {
            result.push([]);
        }

        let active;
        let imgCounter = 0;
        for (let i = 0; i < n; i++) {
            active = 0;
            for (let j = 0; j < columns; j++) {
                if (imagesCopy[imgCounter]) {
                    result[active].push(imagesCopy[imgCounter]);
                    imgCounter++;
                }

                active++;
            }
        }

        return result.map((arr, i) => {
            return (
                <div key={i} className="admin-image-column">
                    {arr.map((image) => (
                        <div
                            key={image.image_id}
                            className="profile-gallery-img-item"
                        >
                            <ImageOpt
                                className="image-input"
                                src={image.image_name}
                                alt=""
                                layout="fill"
                                objectFit="cover"
                            />
                            <div className="profile-gallery-controls">
                                <button
                                    type="button"
                                    className="button delete-btn"
                                    onClick={() =>
                                        handleDeleteImage(image.image_name)
                                    }
                                >
                                    delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            );
        });
    };

    return (
        <>
            <HeadLayout title="Profile" />
            <WithSignin>
                {user && (
                    <div className="profile-page">
                        <div className="profile-aside">
                            {user.avatar && (
                                <div className="profile-avatar-container">
                                    <ImageOpt
                                        className="profile-avatar"
                                        src={user.avatar?.image_name}
                                        alt="avatar"
                                        width={200}
                                        height={200}
                                    />
                                </div>
                            )}
                            <div className="profile-nav-container">
                                <div className="profile-nav-item">
                                    <button
                                        type="button"
                                        onClick={toggleProfileForm}
                                        style={{
                                            backgroundColor: "#00529b",
                                            color: "white",
                                        }}
                                        className="profile-nav-btn"
                                    >
                                        edit profile
                                    </button>
                                </div>
                                <div className="profile-nav-item">
                                    <button
                                        style={
                                            state.activeTab === "details"
                                                ? activeTabStyles
                                                : null
                                        }
                                        type="button"
                                        onClick={() =>
                                            handleChangeActiveTab("details")
                                        }
                                        className="profile-nav-btn"
                                    >
                                        About you
                                    </button>
                                </div>
                                <div className="Linkrofile-nav-item">
                                    <button
                                        style={
                                            state.activeTab === "orders"
                                                ? activeTabStyles
                                                : null
                                        }
                                        type="button"
                                        onClick={() =>
                                            handleChangeActiveTab("orders")
                                        }
                                        className="profile-nav-btn"
                                    >
                                        orderes
                                    </button>
                                </div>
                            </div>
                        </div>
                        {state.activeTab === "details" ? (
                            <div className="profile-main-content">
                                <div className="profile-content-item">
                                    <div className="profile-heading-container">
                                        <p className="profile-heading">
                                            full name
                                        </p>
                                    </div>
                                    <div className="profile-text-container">
                                        <p className="profile-text-content">{`${user.first_name} ${user.last_name}`}</p>
                                    </div>
                                </div>
                                <div className="profile-content-item">
                                    <div className="profile-heading-container">
                                        <p className="profile-heading">
                                            username
                                        </p>
                                    </div>
                                    <div className="profile-text-container">
                                        <p className="profile-text-content">
                                            {user.username}
                                        </p>
                                    </div>
                                </div>
                                <div className="profile-content-item">
                                    <div className="profile-heading-container">
                                        <p className="profile-heading">email</p>
                                    </div>
                                    <div className="profile-text-container">
                                        <p className="profile-text-content">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>
                                <div className="profile-content-item">
                                    <div className="profile-heading-container">
                                        <p className="profile-heading">
                                            phone number
                                        </p>
                                    </div>
                                    <div className="profile-text-container">
                                        <p className="profile-text-content">
                                            {user.phone}
                                        </p>
                                    </div>
                                </div>
                                <AddressList />
                                <CompanyList />
                                <div>
                                    <div className="profile-heading-container">
                                        <h3 className="profile-heading">
                                            gallery
                                        </h3>
                                    </div>

                                    {!gallery ? (
                                        <Loader />
                                    ) : !gallery.length ? (
                                        <div>
                                            <p>your gallery is empty.</p>
                                        </div>
                                    ) : (
                                        <div
                                            className="profile-gallery-container"
                                            style={{
                                                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                                            }}
                                        >
                                            {jsx()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <OrderList />
                        )}
                    </div>
                )}
                {editProfile && <ProfileForm close={toggleProfileForm} />}
            </WithSignin>
        </>
    );
};

export default Profile;

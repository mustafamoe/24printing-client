import { useState } from "react";
import { useSelector } from "react-redux";
import useSWR from "swr";
import { RootReducer } from "../../store/reducers";
import { IAddress } from "../../types/address";

// components
import Loader from "../loader";
import AddressItem from "./addressItem";
import AddressForm from "./addressForm";

const AddressList = () => {
    const user = useSelector((state: RootReducer) => state.auth.user);
    const { data: addresses } = useSWR<IAddress[]>(
        `/addresses?authId=${user.user_id}`
    );
    const [showAddressForm, setAddressForm] = useState(false);
    const [editAddress, setEditAddress] = useState<IAddress | null>(null);

    const toggleAddressForm = () => {
        if (showAddressForm) {
            document.body.style.overflow = "auto";
            setAddressForm(false);
        } else {
            document.body.style.overflow = "hidden";
            setAddressForm(true);
        }
    };

    const toggleEditAddress = (address) => {
        if (editAddress) {
            document.body.style.overflow = "auto";
            setEditAddress(null);
        } else {
            document.body.style.overflow = "hidden";
            setEditAddress(address);
        }
    };

    return (
        <>
            <div className="profile-content-item">
                <div className="profile-heading-container">
                    <p className="profile-heading">addresses</p>
                    <div>
                        <button
                            type="button"
                            className="button"
                            onClick={toggleAddressForm}
                        >
                            add
                        </button>
                    </div>
                </div>
                {!addresses ? (
                    <div>
                        <Loader />
                    </div>
                ) : !addresses.length ? (
                    <div>
                        <p>you don't have any addresses yet.</p>
                    </div>
                ) : (
                    <div>
                        <div className="address-head-item">
                            <div className="address-content-item-head">
                                <p className="address-content-head-text">
                                    address line1
                                </p>
                            </div>
                            <div className="address-content-item-head">
                                <p className="address-content-head-text">
                                    address line1
                                </p>
                            </div>
                            <div className="address-content-item-head">
                                <p className="address-content-head-text">
                                    city
                                </p>
                            </div>
                            <div className="address-content-item-head">
                                <p className="address-content-head-text">
                                    zip/postal code
                                </p>
                            </div>
                        </div>
                        {addresses.map((address) => (
                            <AddressItem
                                key={address.address_id}
                                toggleEditAddress={toggleEditAddress}
                                user={user}
                                address={address}
                            />
                        ))}
                    </div>
                )}
            </div>
            {showAddressForm && <AddressForm close={toggleAddressForm} />}
            {editAddress && (
                <AddressForm address={editAddress} close={toggleEditAddress} />
            )}
        </>
    );
};

export default AddressList;

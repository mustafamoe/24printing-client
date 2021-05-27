import React, { useState } from "react";
import { IAddress } from "../../types/address";
import { IUser } from "../../types/user";
import { apiCall } from "../../utils/apiCall";
import { mutate } from "swr";

interface IProps {
    user: IUser;
    address: IAddress;
    toggleEditAddress: any;
}

const AddressItem = ({ user, address, toggleEditAddress }: IProps) => {
    const [isHover, setHover] = useState(false);

    const handleDelete = async () => {
        try {
            await apiCall(
                "delete",
                `/address/${address.address_id}?authId=${user.user_id}`
            );

            mutate(
                `/addresses?authId=${user.user_id}`,
                (addresses: IAddress[]) => {
                    return addresses.filter(
                        (a) => a.address_id !== address.address_id
                    );
                }
            );
        } catch (err) {}
    };

    return (
        <div
            className="address-item"
            onMouseOver={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div className="address-content-item">
                <p className="address-content-text">{address.line_1}</p>
            </div>
            <div className="address-content-item">
                <p className="address-content-text">{address.line_2}</p>
            </div>
            <div className="address-content-item">
                <p className="address-content-text">{address.city}</p>
            </div>
            <div className="address-content-item">
                <p className="address-content-text">{address.zip_code}</p>
            </div>
            <div
                style={isHover ? { right: "10px" } : null}
                className="company-controls-container"
            >
                <button
                    style={{ marginRight: "10px" }}
                    type="button"
                    onClick={() => toggleEditAddress(address)}
                    className="button"
                >
                    edit
                </button>
                <button
                    type="button"
                    onClick={handleDelete}
                    className="button delete-btn"
                >
                    delete
                </button>
            </div>
        </div>
    );
};

export default AddressItem;

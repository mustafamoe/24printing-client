import { IUser } from "../../types/user";
import { apiCall } from "../../utils/apiCall";
import { UserActionTypes } from "../types/user";

// signin
export const signinLoading = (): UserActionTypes => {
    return {
        type: "SIGNIN_LOADING",
    };
};

export const signinSuccess = (user: IUser): UserActionTypes => {
    return {
        type: "SIGNIN_SUCCESS",
        user,
    };
};

export const signinError = (error: Error): UserActionTypes => {
    return {
        type: "SIGNIN_ERROR",
        error,
    };
};

export const signinRemoveError = (): UserActionTypes => {
    return {
        type: "SIGNIN_REMOVE_ERROR",
    };
};

// signout
export const signoutLoading = (): UserActionTypes => {
    return {
        type: "SIGNOUT_LOADING",
    };
};

export const signoutSuccess = (): UserActionTypes => {
    return {
        type: "SIGNOUT_SUCCESS",
    };
};

export const signoutError = (error: Error): UserActionTypes => {
    return {
        type: "SIGNOUT_ERROR",
        error,
    };
};

export const signoutRemoveError = (): UserActionTypes => {
    return {
        type: "SIGNOUT_REMOVE_ERROR",
    };
};

// signup
export const signupLoading = (): UserActionTypes => {
    return {
        type: "SIGNUP_LOADING",
    };
};

export const signupSuccess = (user: IUser): UserActionTypes => {
    return {
        type: "SIGNUP_SUCCESS",
        user,
    };
};

export const signupError = (error): UserActionTypes => {
    return {
        type: "SIGNUP_ERROR",
        error,
    };
};

export const signupRemoveError = (): UserActionTypes => {
    return {
        type: "SIGNUP_REMOVE_ERROR",
    };
};

// onload
export const signinOnloadLoading = (): UserActionTypes => {
    return {
        type: "SIGNIN_ONLOAD_LOADING",
    };
};

export const signinOnloadSuccess = (user: IUser): UserActionTypes => {
    return {
        type: "SIGNIN_ONLOAD_SUCCESS",
        user,
    };
};

export const signinOnloadError = (): UserActionTypes => {
    return {
        type: "SIGNIN_ONLOAD_ERROR",
    };
};

export const signinOnloadRemoveError = (): UserActionTypes => {
    return {
        type: "SIGNIN_ONLOAD_REMOVE_ERROR",
    };
};

export const editProfileSuccess = (user: IUser): UserActionTypes => {
    return {
        type: "EDIT_PROFILE_SUCCESS",
        user,
    };
};

export const signinCall = (data: any) => async (dispatch) => {
    try {
        dispatch(signinLoading());
        dispatch(signinRemoveError());
        const user = await apiCall<IUser>("post", `/auth/signin`, data);
        dispatch(signinSuccess(user));
    } catch (err) {
        return dispatch(signinError(err));
    }
};

export const signupCall = (data: any) => async (dispatch) => {
    try {
        dispatch(signupLoading());
        dispatch(signupRemoveError());
        const user = await apiCall<IUser>("post", `/auth/signup`, data);
        dispatch(signupSuccess(user));
    } catch (err) {
        return dispatch(signupError(err));
    }
};

export const authOnloadCall = () => async (dispatch) => {
    try {
        dispatch(signinOnloadLoading());
        dispatch(signinOnloadRemoveError());
        const user = await apiCall<IUser>("post", `/auth/onload`);
        dispatch(signinOnloadSuccess(user));
    } catch (err) {
        return dispatch(signinOnloadError());
    }
};

export const signoutCall = () => async (dispatch) => {
    try {
        dispatch(signoutLoading());
        dispatch(signoutRemoveError());
        const msg = await apiCall<string>("post", `/auth/signout`);
        dispatch(signoutSuccess());
    } catch (err) {
        return dispatch(signoutError(err));
    }
};

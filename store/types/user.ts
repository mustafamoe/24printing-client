import { IUser } from "../../types/user";

import {
    SIGNIN_LOADING,
    SIGNIN_SUCCESS,
    SIGNOUT_LOADING,
    SIGNOUT_SUCCESS,
    SIGNOUT_ERROR,
    SIGNOUT_REMOVE_ERROR,
    SIGNIN_ERROR,
    SIGNIN_REMOVE_ERROR,
    SIGNUP_LOADING,
    SIGNUP_SUCCESS,
    SIGNUP_ERROR,
    SIGNUP_REMOVE_ERROR,
    SIGNIN_ONLOAD_LOADING,
    SIGNIN_ONLOAD_SUCCESS,
    SIGNIN_ONLOAD_ERROR,
    SIGNIN_ONLOAD_REMOVE_ERROR,
    EDIT_PROFILE_SUCCESS,
} from "../actionTypes";

// signin
interface SigninLoading {
    type: typeof SIGNIN_LOADING;
}

interface SigninSuccess {
    type: typeof SIGNIN_SUCCESS;
    user: IUser;
}

interface SigninError {
    type: typeof SIGNIN_ERROR;
    error: Error;
}

interface SigninRemoveError {
    type: typeof SIGNIN_REMOVE_ERROR;
}

// signout
interface SignoutLoading {
    type: typeof SIGNOUT_LOADING;
}

interface SignoutSuccess {
    type: typeof SIGNOUT_SUCCESS;
}

interface SignoutError {
    type: typeof SIGNOUT_ERROR;
    error: Error;
}

interface SignoutRemoveError {
    type: typeof SIGNOUT_REMOVE_ERROR;
}

// signup
interface SignupLoading {
    type: typeof SIGNUP_LOADING;
}

interface SignupSuccess {
    type: typeof SIGNUP_SUCCESS;
    user: IUser;
}

interface SignupError {
    type: typeof SIGNUP_ERROR;
    error: any;
}

interface SignupRemoveError {
    type: typeof SIGNUP_REMOVE_ERROR;
}

// signin onload
interface SigninOnloadLoading {
    type: typeof SIGNIN_ONLOAD_LOADING;
}

interface SigninOnloadSuccess {
    type: typeof SIGNIN_ONLOAD_SUCCESS;
    user: IUser;
}

interface SigninOnloadError {
    type: typeof SIGNIN_ONLOAD_ERROR;
}

interface SigninOnloadRemoveError {
    type: typeof SIGNIN_ONLOAD_REMOVE_ERROR;
}

interface EditProfileSuccess {
    type: typeof EDIT_PROFILE_SUCCESS;
    user: IUser;
}

export type UserActionTypes =
    | SigninLoading
    | SigninSuccess
    | SigninError
    | SigninRemoveError
    | SignupLoading
    | SignupSuccess
    | SignupError
    | SignupRemoveError
    | SigninOnloadLoading
    | SigninOnloadSuccess
    | SigninOnloadError
    | SigninOnloadRemoveError
    | SignoutLoading
    | SignoutSuccess
    | SignoutError
    | SignoutRemoveError
    | EditProfileSuccess;

export interface IUserState {
    user: IUser | null;
    signin: {
        loading: boolean;
        error: Error;
    };
    signup: {
        loading: boolean;
        error: any;
        userId: string | null;
    };
    signout: {
        loading: boolean;
    };
    onload: {
        loading: boolean;
    };
}

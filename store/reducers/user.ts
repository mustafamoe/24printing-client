import {
    SIGNIN_LOADING,
    SIGNIN_SUCCESS,
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
    SIGNOUT_LOADING,
    SIGNOUT_SUCCESS,
    SIGNOUT_ERROR,
    SIGNOUT_REMOVE_ERROR,
    EDIT_PROFILE_SUCCESS,
} from "../actionTypes";
import { IUserState, UserActionTypes } from "../types/user";

const INITIAL_STATE: IUserState = {
    user: null,
    signin: {
        loading: false,
        error: null,
    },
    signup: {
        loading: false,
        error: null,
        userId: null,
    },
    signout: {
        loading: false,
    },
    onload: {
        loading: false,
    },
};

const auth = (state = INITIAL_STATE, action: UserActionTypes): IUserState => {
    switch (action.type) {
        case SIGNIN_LOADING:
            return { ...state, signin: { ...state.signin, loading: true } };
        case SIGNIN_SUCCESS:
            return {
                ...state,
                signin: { ...state.signin, loading: false },
                user: action.user,
            };
        case SIGNIN_ERROR:
            return {
                ...state,
                signin: {
                    ...state.signin,
                    loading: false,
                    error: action.error,
                },
            };
        case SIGNIN_REMOVE_ERROR:
            return { ...state, signin: { ...state.signin, error: null } };
        case SIGNUP_LOADING:
            return { ...state, signup: { ...state.signup, loading: true } };
        case SIGNUP_SUCCESS:
            return {
                ...state,
                signup: { ...state.signup, loading: false },
                user: action.user,
            };
        case SIGNUP_ERROR:
            return {
                ...state,
                signup: {
                    ...state.signup,
                    loading: false,
                    error: action.error,
                },
            };
        case SIGNUP_REMOVE_ERROR:
            return { ...state, signup: { ...state.signup, error: null } };
        case SIGNIN_ONLOAD_LOADING:
            return { ...state, onload: { ...state.onload, loading: true } };
        case SIGNIN_ONLOAD_SUCCESS:
            return {
                ...state,
                onload: { ...state.onload, loading: false },
                user: action.user,
            };
        case SIGNIN_ONLOAD_ERROR:
            return { ...state, onload: { ...state.onload, loading: false } };
        case SIGNIN_ONLOAD_REMOVE_ERROR:
            return { ...state, onload: { ...state.onload } };
        case SIGNOUT_LOADING:
            return { ...state, signout: { ...state.signout, loading: true } };
        case SIGNOUT_SUCCESS:
            return {
                ...state,
                signout: { ...state.signout, loading: false },
                user: null,
            };
        case SIGNOUT_ERROR:
            return { ...state, signout: { ...state.signout, loading: false } };
        case SIGNOUT_REMOVE_ERROR:
            return { ...state, signout: { ...state.signout } };
        case EDIT_PROFILE_SUCCESS:
            return { ...state, user: { ...state.user, ...action.user } };
        default:
            return state;
    }
};

export default auth;

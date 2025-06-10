import axios from "axios";
import Cookies from "universal-cookie";

// action
import { profileSuccess, profileError, resetProfileFlagChange } from "./reducer";

// Helper function to get auth token
const getAuthToken = () => {
    const cookies = new Cookies();
    return cookies.get('authUser');
};

// Helper function to get user role
const getUserRole = () => {
    const cookies = new Cookies();
    const userData = cookies.get('user');
    return userData?.role;
};

export const editProfile = (user) => async (dispatch) => {
    try {
        const token = getAuthToken();
        const role = getUserRole();
        const endpoint = role === 'doctor' 
            ? '/users/profile/doctor/'
            : '/users/profile/patient/';
            
        const response = await axios.patch(
            `${process.env.REACT_APP_API_URL}${endpoint}`,
            user,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (response) {
            dispatch(profileSuccess(response));
        }
    } catch (error) {
        dispatch(profileError(error.response?.message || "Failed to update profile"));
    }
};

export const getPatientProfile = () => async (dispatch) => {
    try {
        const token = getAuthToken();
        const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/users/profile/patient/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        if (response) {
            dispatch(profileSuccess(response));
        }
    } catch (error) {
        dispatch(profileError(error.response?.message || "Failed to fetch profile"));
    }
};

export const getDoctorProfile = () => async (dispatch) => {
    try {
        const token = getAuthToken();
        const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/users/profile/doctor/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        if (response) {
            dispatch(profileSuccess(response));
        }
    } catch (error) {
        dispatch(profileError(error.response?.message || "Failed to fetch doctor profile"));
    }
};

export const createPatientProfile = (profileData) => async (dispatch) => {
    try {
        const token = getAuthToken();
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/users/profile/patient/create/`,
            profileData,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (response) {
            dispatch(profileSuccess(response));
        }
    } catch (error) {
        dispatch(profileError(error.response?.message || "Failed to create profile"));
    }
};

export const createDoctorProfile = (profileData) => async (dispatch) => {
    try {
        const token = getAuthToken();
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/users/profile/doctor/create/`,
            profileData,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (response) {
            dispatch(profileSuccess(response));
        }
    } catch (error) {
        dispatch(profileError(error.response?.message || "Failed to create doctor profile"));
    }
};

export const resetProfileFlag = () => {
    try {
        const response = resetProfileFlagChange();
        return response;
    } catch (error) {
        return error;
    }
};
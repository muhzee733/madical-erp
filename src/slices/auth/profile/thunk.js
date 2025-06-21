import axios from "axios";
import Cookies from "universal-cookie";

// action
import {
  profileSuccess,
  profileError,
  resetProfileFlagChange,
} from "./reducer";

// Helper function to get auth token
const getAuthToken = () => {
  const cookies = new Cookies();
  return cookies.get("authUser");
};

// Helper function to get user role
const getUserRole = () => {
  const cookies = new Cookies();
  const userData = cookies.get("user");
  return userData?.role;
};

export const editProfile = (user) => async (dispatch) => {
  try {
    const token = getAuthToken();
    const role = getUserRole();
    const endpoint =
      role === "doctor" ? "/users/profile/doctor/" : "/users/profile/patient/";

    // Remove any undefined or null values
    const cleanUserData = Object.fromEntries(
      Object.entries(user).filter(
        ([_, value]) => value !== undefined && value !== null
      )
    );

    const response = await axios.patch(
      `${process.env.REACT_APP_API_URL}${endpoint}`,
      cleanUserData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data) {
      dispatch(profileSuccess(response.data));
      return response.data;
    }
  } catch (error) {
    console.error("Profile update error:", error);
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.detail ||
      error.message ||
      "Failed to update profile";
    dispatch(profileError(errorMessage));
    throw error;
  }
};

export const getPatientProfile = () => async (dispatch) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/users/profile/patient/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response, "response");
    if (response) {
      dispatch(profileSuccess(response));
    }
  } catch (error) {
    dispatch(
      profileError(error.response?.message || "Failed to fetch profile")
    );
  }
};

export const getDoctorProfile = () => async (dispatch) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/users/profile/doctor/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response) {
      dispatch(profileSuccess(response?.data));
    }
  } catch (error) {
    console.log(error, "error");
    dispatch(profileError(error || "Failed to fetch doctor profile"));
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
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response) {
      dispatch(profileSuccess(response));
    }
  } catch (error) {
    dispatch(
      profileError(error.response?.message || "Failed to create profile")
    );
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
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response) {
      dispatch(profileSuccess(response));
    }
  } catch (error) {
    const errorData = error.response?.data;

    // Convert error object to readable string
    const combinedMessage = errorData
      ? Object.entries(errorData)
          .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
          .join(" | ")
      : error.message || "Something went wrong";

    dispatch(profileError(combinedMessage));
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

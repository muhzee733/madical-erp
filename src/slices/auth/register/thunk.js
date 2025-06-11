//Include Both Helper File with needed methods
import axios from "axios";

// action
import {
  registerUserSuccessful,
  registerUserFailed,
  resetRegisterFlagChange,
  apiErrorChange,
} from "./reducer";

export const registerUser = (user, navigator) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/users/register/`,
      user
    );

    if (response.success === true) {
      dispatch(registerUserSuccessful(response.message));
    }
  } catch (error) {
    let errorMessage = "Registration failed";
    if (error.response?.data?.errors) {
      // Convert the errors object into a string message
      const errors = error.response.data.errors;
      if (errors.email) {
        errorMessage = Array.isArray(errors.email) ? errors.email[0] : errors.email;
      } else if (errors.password) {
        errorMessage = Array.isArray(errors.password) ? errors.password[0] : errors.password;
      } else {
        // If there are other errors, take the first one
        const firstError = Object.values(errors)[0];
        errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
      }
    }
    dispatch(registerUserFailed(errorMessage));
  }
};

export const resetRegisterFlag = () => {
  try {
    const response = resetRegisterFlagChange();
    return response;
  } catch (error) {
    return error;
  }
};

export const apiError = () => {
  try {
    const response = apiErrorChange();
    return response;
  } catch (error) {
    return error;
  }
};

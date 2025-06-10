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

    console.log("Registration response:", response.data);

    if (response.data.success === true) {
      dispatch(registerUserSuccessful(response.data.message));
    }
  } catch (error) {
    let errorMessage = "Registration failed";

    console.log("Registration error:", error); // raw error
    if (error.response && error.response.data) {
      const data = error.response.data;

      console.log("Error response data:", data); // show the actual backend error object

      // Case 1: field-specific errors
      if (data.errors && typeof data.errors === 'object') {
        const messages = Object.values(data.errors).flat().join(" ");
        errorMessage = messages || errorMessage;
      }

      // Case 2: generic message
      else if (data.message) {
        errorMessage = data.message;
      }

      // Case 3: fallback to JSON string
      else {
        errorMessage = JSON.stringify(data);
      }
    }

    console.log("Final error message:", errorMessage);
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

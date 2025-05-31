//Include Both Helper File with needed methods
import axios from "axios";

// action
import {
  registerUserSuccessful,
  registerUserFailed,
  resetRegisterFlagChange,
  apiErrorChange,
} from "./reducer";

// Is user register successfull then direct plot user in redux.
export const registerUser = (user, navigator) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/users/register/`,
      user
    );
    console.log(response, 'response')
    if (response.success === true) {
      dispatch(registerUserSuccessful(response.message));
    }
  } catch (error) {
    if (error.response?.status === 400) {
      const errorMsg = error.response.data.errors.email[0];
      dispatch(registerUserFailed(errorMsg));
    } else {
      dispatch(registerUserFailed("Registration failed"));
    }
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

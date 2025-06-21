//Include Both Helper File with needed methods
import axios from "axios";

// action
import {
  registerUserSuccessful,
  registerUserFailed,
  resetRegisterFlagChange,
  apiErrorChange,
  setRegisterLoading,
} from "./reducer";

export const registerUser = (user, navigator) => async (dispatch) => {
  dispatch(setRegisterLoading());
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/users/register/`,
      user
    );

    if (response.data.success === true) {
      dispatch(registerUserSuccessful(response.message));
    }
  } catch (error) {
    console.log(error)
    dispatch(registerUserFailed(error.response.data.errors.email[0]));
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

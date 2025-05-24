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
    if (response.success === true) {
      dispatch(registerUserSuccessful(response.message));
      const userId = response?.user?.id;
      const answers = JSON.parse(sessionStorage.getItem("preAnswers"));
      const answersArray = Object.entries(answers).map(
        ([questionId, answer]) => ({
          question_id: questionId,
          answer: Array.isArray(answer) ? answer : [answer],
        })
      );

      const finalPayload = {
        user_id: userId,
        responses: answersArray,
      };

      if (answers && userId) {
        try {
          await axios.post(
            `${process.env.REACT_APP_API_URL}/post_answer/`,
            finalPayload
          );
        } catch (error) {
          console.log(error);
        }
      }
    } else if (response.success === false) {
      if (response.errors?.email) {
        dispatch(registerUserFailed(response.errors.email[0]));
      } else {
        dispatch(registerUserFailed(response.errors));
      }
    } else {
      dispatch(registerUserFailed(response.errors));
    }
  } catch (error) {
    console.log("Other Error:", error);
    dispatch(registerUserFailed(error));
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

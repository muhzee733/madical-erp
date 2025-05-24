import Cookies from "universal-cookie";
import {
  loginSuccess,
  logoutUserSuccess,
  apiError,
  reset_login_flag,
} from "./reducer";

export const loginUser = (data, navigate) => async (dispatch) => {
  const cookies = new Cookies();
  try {
    if (data.access) {
      cookies.set("authUser", data.access, { path: "/" });
      cookies.set("user", data.user, { path: "/" });
      dispatch(
        loginSuccess({
          user: data.user,
          token: data.access,
          message: data.message
        })
      );
      const role = data.user?.role;
      console.log(role, 'role')
      switch (role) {
        case "patient":
          navigate("/dashboard/patient");
          break;
        case "doctor":
          navigate("/dashboard/doctor");
          break;
        case "admin":
          navigate("/dashboard/admin");
          break;
        default:
          navigate("/unauthorized");
          cookies.remove("authUser");
          cookies.remove("user");
          break;
      }
    } else {
      dispatch(apiError(data.message));
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const logoutUser = () => async (dispatch) => {
  const cookies = new Cookies();
  try {
    cookies.remove("authUser", { path: "/" });
    cookies.remove("user", { path: "/" });
    dispatch(logoutUserSuccess(true));
  } catch (error) {
    dispatch(apiError(error));
  }
};


export const resetLoginFlag = () => async (dispatch) => {
  try {
    const response = dispatch(reset_login_flag());
    return response;
  } catch (error) {
    dispatch(apiError(error));
  }
};

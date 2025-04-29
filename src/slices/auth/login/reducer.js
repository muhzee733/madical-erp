import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  user: {},
  message: '',
  token: null,
  error: "", 
  loading: false,
  isUserLogout: false,
  errorMsg: false,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    apiError(state, action) {
      state.error = action.payload;
      state.message = '',
      state.loading = false;
      state.isUserLogout = false;
      state.errorMsg = true;
    },
    loginSuccess(state, action) {
      state.message = action.payload.message,
      state.user = action.payload.user;
      state.token = action.payload.access;
      state.loading = false;
      state.errorMsg = false;
    },
    logoutUserSuccess(state, action) {
      state.isUserLogout = true
      state.message = ''
    },
    reset_login_flag(state) {
      state.loading = false;
      state.message = ''
    }
  },
});

export const {
  apiError,
  loginSuccess,
  logoutUserSuccess,
  reset_login_flag
} = loginSlice.actions

export default loginSlice.reducer;
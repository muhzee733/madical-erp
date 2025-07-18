import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  registrationError: null,
  message: null,
  loading: false,
  user: null,
  success: false,
  error: false
};

const registerSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    registerUserSuccessful(state, action) {
      state.user = action.payload;
      state.loading = false;
      state.success = true;
      state.registrationError = null;
    },
    registerUserFailed(state, action) {
      state.user = null;
      state.loading = false;
      state.registrationError = action.payload;
      state.error = true;
    },
    resetRegisterFlagChange(state) {
      state.success = false;
      state.error = false;
    },
    apiErrorChange(state, action){
      state.error = action.payload;
      state.loading = false;
      state.isUserLogout = false;
    },
    setRegisterLoading(state) {
      state.loading = true;
    }
  }
});

export const {
  registerUserSuccessful,
  registerUserFailed,
  resetRegisterFlagChange,
  apiErrorChange,
  setRegisterLoading
} = registerSlice.actions;

export default registerSlice.reducer;
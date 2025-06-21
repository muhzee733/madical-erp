import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  error: "",
  success: "",
  user: {}
};

const ProfileSlice = createSlice({
  name: "Profile",
  initialState,
  reducers: { 
    profileSuccess(state, action) {
      console.log(action, 'action')
      state.success = action.payload.success;
      state.user = action.payload.user
    },
    profileError(state, action) {
        state.error = action.payload
    },
    editProfileChange(state){
      state = { ...state };
    },
    resetProfileFlagChange(state){
      state.success = null
    }
  },
});

export const {
    profileSuccess,
    profileError,
    editProfileChange,
    resetProfileFlagChange
} = ProfileSlice.actions

export default ProfileSlice.reducer;
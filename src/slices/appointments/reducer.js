import { createSlice } from "@reduxjs/toolkit";
import { getAppointments } from "./thunk";

export const initialState = {
  appointments: [],
  error: null,
};

const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAppointments.fulfilled, (state, action) => {
        state.appointments = action.payload;
        state.error = null;
      })
      .addCase(getAppointments.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!";
      });
  },
});

export default appointmentSlice.reducer;

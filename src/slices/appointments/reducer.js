import { createSlice } from "@reduxjs/toolkit";
import { getAppointments, getAppointmentById } from "./thunk";

export const initialState = {
  appointments: [],
  selectedAppointment: null,
  error: null,
  loading: false,
};

const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {
    clearSelectedAppointment: (state) => {
      state.selectedAppointment = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
        state.error = null;
      })
      .addCase(getAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong!";
      })
      .addCase(getAppointmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAppointmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAppointment = action.payload;
        state.error = null;
      })
      .addCase(getAppointmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong!";
      });
  },
});

export const { clearSelectedAppointment } = appointmentSlice.actions;
export default appointmentSlice.reducer;

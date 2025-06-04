import { createSlice } from "@reduxjs/toolkit";
import { getAppointments, getAppointmentById, getDoctorSchedules } from "./thunk";

export const initialState = {
  appointments: [],
  selectedAppointment: null,
  doctorSchedules: [],
  error: null,
  loading: false,
  lastUpdated: null,
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
        state.lastUpdated = Date.now();
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
      })
      .addCase(getDoctorSchedules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDoctorSchedules.fulfilled, (state, action) => {
        state.loading = false;
        state.doctorSchedules = action.payload.results;
        state.error = null;
      })
      .addCase(getDoctorSchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong!";
      });
  },
});

export const { clearSelectedAppointment } = appointmentSlice.actions;
export default appointmentSlice.reducer;

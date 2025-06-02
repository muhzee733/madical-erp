import { createSlice } from "@reduxjs/toolkit";
import { getPatientAppointments } from "./thunk";

const initialState = {
  appointments: [],
  loading: false,
  error: null,
};

const patientAppointmentSlice = createSlice({
  name: "patientAppointment",
  initialState,
  reducers: {
    clearAppointments: (state) => {
      state.appointments = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPatientAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPatientAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(getPatientAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAppointments } = patientAppointmentSlice.actions;
export default patientAppointmentSlice.reducer; 
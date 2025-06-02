import { createSlice } from "@reduxjs/toolkit";
import { getPatientAppointments, getMyAppointments } from "./thunk";

const initialState = {
  appointments: [],
  myAppointments: [],
  loading: false,
  myAppointmentsLoading: false,
  error: null,
  myAppointmentsError: null,
};

const patientAppointmentSlice = createSlice({
  name: "patientAppointment",
  initialState,
  reducers: {
    clearAppointments: (state) => {
      state.appointments = [];
      state.error = null;
    },
    clearMyAppointments: (state) => {
      state.myAppointments = [];
      state.myAppointmentsError = null;
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
      })
      .addCase(getMyAppointments.pending, (state) => {
        state.myAppointmentsLoading = true;
        state.myAppointmentsError = null;
      })
      .addCase(getMyAppointments.fulfilled, (state, action) => {
        state.myAppointmentsLoading = false;
        state.myAppointments = action.payload;
      })
      .addCase(getMyAppointments.rejected, (state, action) => {
        state.myAppointmentsLoading = false;
        state.myAppointmentsError = action.payload;
      });
  },
});

export const { clearAppointments, clearMyAppointments } = patientAppointmentSlice.actions;
export default patientAppointmentSlice.reducer; 
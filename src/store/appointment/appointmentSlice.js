import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAppointmentById = createAsyncThunk(
  "appointment/fetchById",
  async (id) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/appointments/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
);

const appointmentSlice = createSlice({
  name: "appointment",
  initialState: {
    appointments: [],
    appointmentDetails: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearAppointmentDetails: (state) => {
      state.appointmentDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.appointmentDetails = action.payload;
      })
      .addCase(fetchAppointmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearAppointmentDetails } = appointmentSlice.actions;
export default appointmentSlice.reducer; 
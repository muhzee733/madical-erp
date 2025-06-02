import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

// Thunk
export const getAppointments = createAsyncThunk(
  "/all",
  async (_, { rejectWithValue }) => { 
    try {
      const token = Cookies.get('authUser');
      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const response = await axios.get(`${process.env.REACT_APP_API_URL}/appointments/my/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      return response;
    } catch (error) {
      return rejectWithValue(error.response || error.message);
    }
  }
);

export const getAppointmentById = createAsyncThunk(
  "appointments/getById",
  async (appointmentId, { rejectWithValue }) => {
    try {
      const token = Cookies.get('authUser');
      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const response = await axios.get(`${process.env.REACT_APP_API_URL}/appointments/${appointmentId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      return response;
    } catch (error) {
      return rejectWithValue(error.response || error.message);
    }
  }
);

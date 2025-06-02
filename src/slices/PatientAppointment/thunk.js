import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

export const getPatientAppointments = createAsyncThunk(
  "patientAppointments/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get('authUser');
      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const response = await axios.get(`${process.env.REACT_APP_API_URL}/appointments/all/`, {
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

export const getMyAppointments = createAsyncThunk(
  "patientAppointments/getMy",
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

export const rescheduleAppointment = createAsyncThunk(
  "patientAppointments/reschedule",
  async ({ appointmentId, newAvailabilityId }, { rejectWithValue }) => {
    try {
      const token = Cookies.get('authUser');
      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/appointments/${appointmentId}/reschedule/`,
        { new_availability_id: newAvailabilityId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      return response;
    } catch (error) {
      return rejectWithValue(error.response || error.message);
    }
  }
);

export const cancelAppointment = createAsyncThunk(
  "patientAppointments/cancel",
  async (appointmentId, { rejectWithValue }) => {
    try {
      const token = Cookies.get('authUser');
      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/appointments/${appointmentId}/cancel/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      return response;
    } catch (error) {
      return rejectWithValue(error.response || error.message);
    }
  }
); 
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
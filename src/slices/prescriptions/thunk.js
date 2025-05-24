import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Create prescription
export const createPrescription = createAsyncThunk(
  "prescriptions/create",
  async (prescriptionData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/prescriptions/`,
        prescriptionData
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create prescription");
    }
  }
);

// List prescriptions
export const getPrescriptions = createAsyncThunk(
  "prescriptions/list",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/prescriptions/list/`
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch prescriptions");
    }
  }
);

// Download prescription PDF
export const downloadPrescriptionPDF = createAsyncThunk(
  "prescriptions/downloadPDF",
  async (prescriptionId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/prescriptions/pdf/${prescriptionId}/`,
        {
          responseType: 'blob'
        }
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to download prescription");
    }
  }
); 
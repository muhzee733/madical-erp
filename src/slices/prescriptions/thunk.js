import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// POST: Create prescription
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
      return rejectWithValue(error.response || "Failed to create prescription");
    }
  }
);

export const getPrescription = createAsyncThunk(
  "prescriptions/getPrescription",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/prescriptions/list/`
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response || error.message);
    }
  }
);

export const searchPrescriptions = createAsyncThunk(
  "prescriptions/search",
  async (searchTerm, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/prescriptions/list/?search=${searchTerm}`
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response || error.message);
    }
  }
);

export const searchDrugs = createAsyncThunk(
  "prescriptions/searchDrugs",
  async (searchTerm, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/drugs/?search=${searchTerm}`
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response || error.message);
    }
  }
);

export const searchSupplierProducts = createAsyncThunk(
  "prescriptions/searchSupplierProducts",
  async (searchTerm, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/supplier-products/?search=${searchTerm}`
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response || error.message);
    }
  }
);

export const downloadPrescriptionPDF = createAsyncThunk(
  "prescriptions/downloadPDF",
  async (prescriptionId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/prescriptions/pdf/${prescriptionId}/`,
        { responseType: 'blob' }
      );
      return { id: prescriptionId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response || error.message);
    }
  }
);

export const searchPatients = createAsyncThunk(
  "prescriptions/searchPatients",
  async (searchTerm, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/prescription/patient/?search=${searchTerm}`
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response || error.message);
    }
  }
);

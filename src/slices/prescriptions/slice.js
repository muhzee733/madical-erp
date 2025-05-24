import { createSlice } from "@reduxjs/toolkit";
import { createPrescription, getPrescriptions, downloadPrescriptionPDF } from "./thunk";

const initialState = {
  prescriptions: [],
  loading: false,
  error: null,
  success: false,
};

const prescriptionSlice = createSlice({
  name: "prescriptions",
  initialState,
  reducers: {
    resetPrescriptionState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create prescription
      .addCase(createPrescription.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createPrescription.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.prescriptions.push(action.payload);
      })
      .addCase(createPrescription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get prescriptions
      .addCase(getPrescriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPrescriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.prescriptions = action.payload;
      })
      .addCase(getPrescriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Download PDF
      .addCase(downloadPrescriptionPDF.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(downloadPrescriptionPDF.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(downloadPrescriptionPDF.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPrescriptionState } = prescriptionSlice.actions;
export default prescriptionSlice.reducer; 
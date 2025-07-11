import { createSlice } from "@reduxjs/toolkit";
import { createPrescription, searchDrugs, getPrescription, downloadPrescriptionPDF, searchPrescriptions, searchSupplierProducts, searchPatients } from "./thunk";

const initialState = {
  prescriptions: [],
  searchResults: [],
  drugResults: [],
  supplierResults: [],
  patientResults: [],
  loading: false,
  formLoading: false,
  error: null,
  success: false,
  downloadingIds: [],
};

const prescriptionSlice = createSlice({
  name: "prescriptions",
  initialState,
  reducers: {
    resetPrescriptionState: (state) => {
      state.loading = false;
      state.formLoading = false;
      state.error = null;
      state.success = false;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Prescription
      .addCase(createPrescription.pending, (state) => {
        state.formLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createPrescription.fulfilled, (state, action) => {
        state.formLoading = false;
        state.success = true;
        if (state.prescriptions.results) {
          state.prescriptions.results.unshift(action.payload);
          state.prescriptions.count += 1;
        }
      })
      .addCase(createPrescription.rejected, (state, action) => {
        state.formLoading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Get Prescription
      .addCase(getPrescription.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPrescription.fulfilled, (state, action) => {
        state.loading = false;
        state.prescriptions = action.payload;
      })
      .addCase(getPrescription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Search Prescriptions
      .addCase(searchPrescriptions.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchPrescriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchPrescriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Search Drugs
      .addCase(searchDrugs.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchDrugs.fulfilled, (state, action) => {
        state.loading = false;
        state.drugResults = action.payload;
      })
      .addCase(searchDrugs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Search Supplier Products
      .addCase(searchSupplierProducts.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchSupplierProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.supplierResults = action.payload;
      })
      .addCase(searchSupplierProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Search Patients
      .addCase(searchPatients.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.patientResults = action.payload;
      })
      .addCase(searchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Download PDF
      .addCase(downloadPrescriptionPDF.pending, (state, action) => {
        state.downloadingIds.push(action.meta.arg);
        state.error = null;
      })
      .addCase(downloadPrescriptionPDF.fulfilled, (state, action) => {
        state.downloadingIds = state.downloadingIds.filter(id => id !== action.meta.arg);
        // Create a blob URL and trigger download
        const blob = new Blob([action.payload.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `prescription-${action.payload.id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      })
      .addCase(downloadPrescriptionPDF.rejected, (state, action) => {
        state.downloadingIds = state.downloadingIds.filter(id => id !== action.meta.arg);
        state.error = action.payload;
      });
  },
});

export const { resetPrescriptionState, clearSuccess } = prescriptionSlice.actions;
export default prescriptionSlice.reducer;

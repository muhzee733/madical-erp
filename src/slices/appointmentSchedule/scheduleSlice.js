import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/create-schedule/`;

// Async thunk for posting schedule
export const postSchedule = createAsyncThunk(
  "schedule/postSchedule",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, payload);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const scheduleSlice = createSlice({
  name: "schedule",
  initialState: {
    loading: false,
    error: null,
    success: false,
    schedules: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(postSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(postSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.schedules.push(action.payload); // append to schedule list
      })
      .addCase(postSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export default scheduleSlice.reducer;

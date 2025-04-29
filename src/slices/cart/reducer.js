import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.items.find(
        (appointment) => appointment.id === item.id
      );
      if (!existingItem) {
        state.items.push(item);
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (appointment) => appointment.id !== action.payload.id
      );
    },
    clearCart: (state) => {
      state.items = [];
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { addToCart, removeFromCart, clearCart, setLoading, setError } = bookingSlice.actions;

export default bookingSlice.reducer;

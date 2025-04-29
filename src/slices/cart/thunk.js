// src/slices/appointments/thunk.js
import { addToCart,setLoading, setError } from "./reducer";

export const addAppointmentToCart = (appointment) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    setTimeout(() => {
      dispatch(addToCart(appointment));
      dispatch(setLoading(false));
    }, 1000);
  } catch (error) {
    dispatch(setError('Failed to add appointment'));
    dispatch(setLoading(false));
  }
};
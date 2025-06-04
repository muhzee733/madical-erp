import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  getPatientAppointments, 
  getMyAppointments,
  rescheduleAppointment,
  cancelAppointment 
} from "../../slices/PatientAppointment/thunk";
import {
  addToCart,
  removeFromCart,
} from "../../slices/PatientAppointment/cartSlice";
import MiniAppointment from "./MiniAppointment";
import CartOffcanvas from "./CartOffcanvas";
import RescheduleOffcanvas from "./RescheduleOffcanvas";
import { Button, Spinner, Alert } from "reactstrap";
import MyAppointments from "./MyAppointments";

// Cache object to store API responses
const apiCache = {
  appointments: null,
  myAppointments: null,
  lastFetched: null,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes in milliseconds
};

const DashboardPatient = () => {
  const dispatch = useDispatch();
  const { appointments, myAppointments, loading, error } = useSelector(
    (state) => state.patientAppointment
  );
  const cartItems = useSelector((state) => state.appointmentCart.items);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchAllData = useCallback(async () => {
    try {
      // Check if we have cached data that's still valid
      const now = Date.now();
      if (
        apiCache.appointments &&
        apiCache.myAppointments &&
        apiCache.lastFetched &&
        now - apiCache.lastFetched < apiCache.CACHE_DURATION
      ) {
        console.log("Using cached data");
        return;
      }

      // If no cache or cache expired, fetch new data
      const [appointmentsResponse, myAppointmentsResponse] = await Promise.all([
        dispatch(getPatientAppointments()).unwrap(),
        dispatch(getMyAppointments()).unwrap(),
      ]);

      // Update cache
      apiCache.appointments = appointmentsResponse;
      apiCache.myAppointments = myAppointmentsResponse;
      apiCache.lastFetched = now;
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsInitialLoad(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleBookSlot = useCallback((slot) => {
    // Format the slot data to only include necessary information
    const formattedSlot = {
      id: slot.id,
      start_time: slot.start_time,
      end_time: slot.end_time,
      doctor: {
        id: slot.doctor.id,
        first_name: slot.doctor.first_name,
        last_name: slot.doctor.last_name
      }
    };
    dispatch(addToCart(formattedSlot));
    setIsCartOpen(true);
  }, [dispatch]);

  const handleRemoveFromCart = useCallback((slotId) => {
    dispatch(removeFromCart(slotId));
  }, [dispatch]);

  const handleCheckout = useCallback(() => {
    // TODO: Implement checkout logic
    console.log("Checkout with items:", cartItems);
  }, [cartItems]);

  const handleReschedule = useCallback((appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setIsRescheduleOpen(true);
  }, []);

  const handleRescheduleSuccess = useCallback(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleCancelAppointment = useCallback(async (appointmentId) => {
    try {
      await dispatch(cancelAppointment(appointmentId)).unwrap();
      // Refresh data after cancellation
      fetchAllData();
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
    }
  }, [dispatch, fetchAllData]);

  // Group doctors from appointments
  const doctors = appointments?.results?.reduce((acc, slot) => {
    const doctorId = slot.doctor.id;
    if (!acc[doctorId]) {
      acc[doctorId] = {
        id: doctorId,
        name: `${slot.doctor.first_name} ${slot.doctor.last_name}`,
        appointments: []
      };
    }
    // Only add if not booked
    if (!slot.is_booked) {
      acc[doctorId].appointments.push(slot);
    }
    return acc;
  }, {}) || {};

  const doctorsList = Object.values(doctors);

  // Function to force refresh data
  const refreshData = useCallback(() => {
    apiCache.appointments = null;
    apiCache.myAppointments = null;
    apiCache.lastFetched = null;
    fetchAllData();
  }, [fetchAllData]);

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h4 className="card-title mb-0">Available Appointments</h4>
                <div className="d-flex gap-2">
                  <Button
                    color="info"
                    onClick={refreshData}
                    disabled={loading}
                  >
                    <i className="ri-refresh-line me-1"></i>
                    Refresh
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => setIsCartOpen(true)}
                    className="position-relative"
                  >
                    <i className="ri-shopping-cart-line me-1"></i>
                    Cart
                    {cartItems.length > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {cartItems.length}
                      </span>
                    )}
                  </Button>
                </div>
              </div>
              <div className="card-body">
                {isInitialLoad || loading ? (
                  <div className="text-center">
                    <Spinner color="primary" />
                    <span className="ms-2">Loading appointments...</span>
                  </div>
                ) : error ? (
                  <Alert color="danger">{error}</Alert>
                ) : !appointments?.results || appointments.results.length === 0 ? (
                  <div className="text-center text-muted">
                    <i className="ri-calendar-line display-4 mb-3"></i>
                    <p>No doctor appointments available at the moment</p>
                    <p className="small">Please check back later for new appointment slots</p>
                  </div>
                ) : doctorsList.length === 0 ? (
                  <div className="text-center text-muted">
                    <i className="ri-calendar-line display-4 mb-3"></i>
                    <p>No available time slots found</p>
                    <p className="small">All appointments have been booked</p>
                  </div>
                ) : (
                  <div className="row">
                    {doctorsList.map((doctor) => (
                      <div key={doctor.id} className="col-12">
                        <MiniAppointment
                          doctor={doctor}
                          appointments={{ results: doctor.appointments }}
                          onBookSlot={handleBookSlot}
                          loading={loading}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-12">
            <MyAppointments 
              appointments={myAppointments}
              loading={loading}
              error={error}
              onReschedule={handleReschedule}
              onCancel={handleCancelAppointment}
            />
          </div>
        </div>
      </div>

      <CartOffcanvas
        isOpen={isCartOpen}
        toggle={() => setIsCartOpen(!isCartOpen)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
        onSuccess={refreshData}
      />

      <RescheduleOffcanvas
        isOpen={isRescheduleOpen}
        toggle={() => setIsRescheduleOpen(!isRescheduleOpen)}
        appointmentId={selectedAppointmentId}
        onSuccess={handleRescheduleSuccess}
        availableSlots={appointments}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default React.memo(DashboardPatient);

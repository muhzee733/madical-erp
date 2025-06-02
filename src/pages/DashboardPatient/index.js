import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPatientAppointments } from "../../slices/PatientAppointment/thunk";
import { addToCart, removeFromCart } from "../../slices/PatientAppointment/cartSlice";
import MiniAppointment from "./MiniAppointment";
import CartOffcanvas from "./CartOffcanvas";
import { Button, Spinner, Alert } from "reactstrap";

const DashboardPatient = () => {
  const dispatch = useDispatch();
  const { appointments, loading, error } = useSelector((state) => state.patientAppointment);
  const cartItems = useSelector((state) => state.appointmentCart.items);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    dispatch(getPatientAppointments());
  }, [dispatch]);

  const handleBookSlot = (slot) => {
    dispatch(addToCart(slot));
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (slotId) => {
    dispatch(removeFromCart(slotId));
  };

  const handleCheckout = () => {
    // TODO: Implement checkout logic
    console.log("Checkout with items:", cartItems);
  };

  // Group doctors from appointments
  const doctors = [...new Set(appointments?.results?.map(slot => slot.doctor) || [])].map(doctorId => {
    const slot = appointments?.results?.find(s => s.doctor === doctorId);
    return {
      id: doctorId,
      name: `Doctor ${doctorId}` // You might want to fetch doctor names from an API
    };
  });

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h4 className="card-title mb-0">Available Appointments</h4>
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
              <div className="card-body">
                {loading ? (
                  <div className="text-center">
                    <Spinner color="primary" />
                    <span className="ms-2">Loading appointments...</span>
                  </div>
                ) : error ? (
                  <Alert color="danger">
                    {error}
                  </Alert>
                ) : (
                  <div className="row">
                    {doctors.map((doctor) => (
                      <div key={doctor.id} className="col-12">
                        <MiniAppointment
                          doctor={doctor}
                          appointments={appointments}
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
      </div>

      <CartOffcanvas
        isOpen={isCartOpen}
        toggle={() => setIsCartOpen(!isCartOpen)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />
    </div>
  );
};

export default DashboardPatient;

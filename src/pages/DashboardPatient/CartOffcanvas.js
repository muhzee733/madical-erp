import React, { useState } from "react";
import {
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody,
  Button,
  ListGroup,
  ListGroupItem,
  Badge,
  Card,
  CardBody,
  Alert,
} from "reactstrap";
import axios from "axios";
import Cookies from "js-cookie";

const CartOffcanvas = ({
  isOpen,
  toggle,
  cartItems,
  onRemoveItem,
  onCheckout,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleBookAppointment = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const token = Cookies.get("authUser");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/appointments/`,
        {
          availability_id: cartItems[0].id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response && response.data) {
        setSuccess(true);
        onRemoveItem(cartItems[0].id);
        // Clear cart and close offcanvas
        onCheckout();
        // Trigger data refresh in parent component
        onSuccess();
        // Reset local state and close offcanvas after showing success message
        setTimeout(() => {
          setSuccess(false);
          setError(null);
          toggle(); // Close the offcanvas
        }, 1000);
      }
    } catch (error) {
      if (error) {
        setError(error.response.data.non_field_errors[0]);
      } else {
        setError(error?.message || "Failed to book appointment");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Offcanvas isOpen={isOpen} toggle={toggle} direction="end">
      <OffcanvasHeader toggle={toggle}>
        <h5 className="mb-0">Appointment Cart</h5>
      </OffcanvasHeader>
      <OffcanvasBody>
        {cartItems.length === 0 ? (
          <div className="text-center text-muted">No appointments in cart</div>
        ) : (
          <>
            <ListGroup flush>
              {cartItems.map((item) => (
                <ListGroupItem key={item.id} className="p-0 mb-3">
                  <Card className="border shadow-none">
                    <CardBody>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h6 className="mb-1">
                            <span className="text-muted">Doctor:</span> Dr.{" "}
                            {item.doctor.first_name} {item.doctor.last_name}
                          </h6>
                        </div>
                        <Button
                          color="danger"
                          size="sm"
                          onClick={() => onRemoveItem(item.id)}
                        >
                          <i className="ri-delete-bin-line"></i>
                        </Button>
                      </div>
                      <div className="appointment-details">
                        <div className="mb-2">
                          <label className="text-muted d-block mb-1">
                            Date:
                          </label>
                          <p className="mb-0">
                            <i className="ri-calendar-line me-2"></i>
                            {new Date(item.start_time).toLocaleDateString(
                              undefined,
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                        <div className="mb-2">
                          <label className="text-muted d-block mb-1">
                            Time:
                          </label>
                          <p className="mb-0">
                            <i className="ri-time-line me-2"></i>
                            {new Date(item.start_time).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            -{" "}
                            {new Date(item.end_time).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </ListGroupItem>
              ))}
            </ListGroup>

            {error && (
              <Alert color="danger" className="mt-3">
                <i className="ri-error-warning-line me-2"></i>
                {error}
              </Alert>
            )}

            {success && (
              <Alert color="success" className="mt-3">
                <i className="ri-checkbox-circle-line me-2"></i>
                Appointment booked successfully!
              </Alert>
            )}

            <div className="mt-4">
              <Button
                color="primary"
                className="w-100"
                onClick={handleBookAppointment}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="ri-loader-4-line me-2"></i>
                    Booking...
                  </>
                ) : (
                  <>
                    <i className="ri-calendar-check-line me-2"></i>
                    Book Appointment
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </OffcanvasBody>
    </Offcanvas>
  );
};

export default CartOffcanvas;

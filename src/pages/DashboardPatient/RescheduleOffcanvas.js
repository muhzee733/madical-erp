import React, { useState, useEffect } from "react";
import { Offcanvas, OffcanvasHeader, OffcanvasBody, Button, ListGroup, ListGroupItem, Badge, Card, CardBody, Alert, Spinner } from "reactstrap";
import axios from 'axios';
import Cookies from 'js-cookie';

const RescheduleOffcanvas = ({ 
  isOpen, 
  toggle, 
  appointmentId, 
  onSuccess,
  availableSlots,
  loading,
  error
}) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [rescheduling, setRescheduling] = useState(false);
  const [rescheduleError, setRescheduleError] = useState(null);

  // Reset states when offcanvas opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedSlot(null);
      setRescheduleError(null);
    }
  }, [isOpen]);

  const handleReschedule = async () => {
    if (!selectedSlot) return;

    try {
      setRescheduling(true);
      setRescheduleError(null);
      
      const token = Cookies.get('authUser');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/appointments/${appointmentId}/reschedule/`,
        {
          new_availability_id: selectedSlot.id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      if (response) {
        onSuccess();
        toggle();
      }
    } catch (error) {
      setRescheduleError(error.response?.data?.message || 'Failed to reschedule appointment');
    } finally {
      setRescheduling(false);
    }
  };

  // Group slots by date
  const slotsByDate = availableSlots?.results?.reduce((acc, slot) => {
    const date = new Date(slot.start_time).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(slot);
    return acc;
  }, {}) || {};

  const dates = Object.keys(slotsByDate).sort((a, b) => new Date(a) - new Date(b));

  return (
    <Offcanvas isOpen={isOpen} toggle={toggle} direction="end">
      <OffcanvasHeader toggle={toggle}>
        <h5 className="mb-0">Reschedule Appointment</h5>
      </OffcanvasHeader>
      <OffcanvasBody>
        {loading ? (
          <div className="text-center">
            <Spinner color="primary" />
            <span className="ms-2">Loading available slots...</span>
          </div>
        ) : error ? (
          <Alert color="danger">
            <i className="ri-error-warning-line me-2"></i>
            {error}
          </Alert>
        ) : !availableSlots?.results || availableSlots.results.length === 0 ? (
          <div className="text-center text-muted">
            <i className="ri-calendar-line display-4 mb-3"></i>
            <p>No available time slots found</p>
            <p className="small">Please try again later</p>
          </div>
        ) : (
          <>
            <ListGroup flush>
              {dates.map((date) => (
                <ListGroupItem key={date} className="p-0 mb-3">
                  <Card className="border shadow-none">
                    <CardBody>
                      <h6 className="mb-3">
                        <i className="ri-calendar-line me-2"></i>
                        {new Date(date).toLocaleDateString(undefined, {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </h6>
                      <div className="d-flex flex-wrap gap-2">
                        {slotsByDate[date].map((slot) => (
                          <Button
                            key={slot.id}
                            color={selectedSlot?.id === slot.id ? "primary" : "outline-primary"}
                            onClick={() => setSelectedSlot(slot)}
                          >
                            {new Date(slot.start_time).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </Button>
                        ))}
                      </div>
                    </CardBody>
                  </Card>
                </ListGroupItem>
              ))}
            </ListGroup>

            {rescheduleError && (
              <Alert color="danger" className="mt-3">
                <i className="ri-error-warning-line me-2"></i>
                {rescheduleError}
              </Alert>
            )}

            <div className="mt-4">
              <Button
                color="primary"
                className="w-100"
                onClick={handleReschedule}
                disabled={!selectedSlot || rescheduling}
              >
                {rescheduling ? (
                  <>
                    <i className="ri-loader-4-line me-2"></i>
                    Rescheduling...
                  </>
                ) : (
                  <>
                    <i className="ri-calendar-event-line me-2"></i>
                    Reschedule Appointment
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

export default RescheduleOffcanvas; 
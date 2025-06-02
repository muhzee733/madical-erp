import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Spinner, Alert, Badge, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getMyAppointments, rescheduleAppointment, cancelAppointment } from '../../slices/PatientAppointment/thunk';

const MyAppointments = () => {
  const dispatch = useDispatch();
  const { myAppointments, myAppointmentsLoading, myAppointmentsError } = useSelector(
    (state) => state.patientAppointment
  );
  const [cancelModal, setCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    dispatch(getMyAppointments());
  }, [dispatch]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'booked':
        return <Badge color="success">Booked</Badge>;
      case 'completed':
        return <Badge color="secondary">Completed</Badge>;
      case 'cancelled':
        return <Badge color="danger">Cancelled</Badge>;
      case 'rescheduled':
        return <Badge color="warning">Rescheduled</Badge>;
      default:
        return <Badge color="info">{status}</Badge>;
    }
  };

  const handleReschedule = (appointmentId) => {
    // TODO: Implement reschedule logic with new availability selection
    console.log('Reschedule appointment:', appointmentId);
  };

  const handleCancelClick = (appointment) => {
    setSelectedAppointment(appointment);
    setCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    if (selectedAppointment) {
      try {
        await dispatch(cancelAppointment(selectedAppointment.id)).unwrap();
        setCancelModal(false);
        setSelectedAppointment(null);
        // Refresh appointments list
        dispatch(getMyAppointments());
      } catch (error) {
        console.error('Failed to cancel appointment:', error);
      }
    }
  };

  if (myAppointmentsLoading) {
    return (
      <div className="text-center p-5">
        <Spinner color="primary" />
        <span className="ms-2">Loading appointments...</span>
      </div>
    );
  }

  if (myAppointmentsError) {
    return (
      <Alert color="danger">
        <i className="ri-error-warning-line me-2"></i>
        {myAppointmentsError}
      </Alert>
    );
  }

  return (
    <div className="my-appointments">
      <Card>
        <CardHeader className="d-flex justify-content-between align-items-center">
          <h4 className="card-title mb-0">My Appointments</h4>
        </CardHeader>
        <CardBody>
          {!myAppointments?.results || myAppointments.results.length === 0 ? (
            <div className="text-center text-muted">
              <i className="ri-calendar-line display-4 mb-3"></i>
              <p>No appointments found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Patient</th>
                    <th>Booked At</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myAppointments.results.map((appointment, index) => (
                    <tr key={appointment.id}>
                      <td>{index + 1}</td>
                      <td>
                        <h6 className="mb-0">
                          {appointment.patient.first_name} {appointment.patient.last_name}
                        </h6>
                        <small className="text-muted">{appointment.patient.email}</small>
                      </td>
                      <td>
                        {new Date(appointment.booked_at).toLocaleString(undefined, {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td>
                        {getStatusBadge(appointment.status)}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          {appointment.status === 'booked' && (
                            <>
                              <Button
                                color="warning"
                                size="sm"
                                onClick={() => handleReschedule(appointment.id)}
                              >
                                <i className="ri-calendar-event-line me-1"></i>
                                Reschedule
                              </Button>
                              <Button
                                color="danger"
                                size="sm"
                                onClick={() => handleCancelClick(appointment)}
                              >
                                <i className="ri-close-circle-line me-1"></i>
                                Cancel
                              </Button>
                            </>
                          )}
                          {appointment.rescheduled_from && (
                            <Badge color="info">
                              <i className="ri-history-line me-1"></i>
                              Rescheduled
                            </Badge>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Cancel Confirmation Modal */}
      <Modal isOpen={cancelModal} toggle={() => setCancelModal(false)}>
        <ModalHeader toggle={() => setCancelModal(false)}>
          Cancel Appointment
        </ModalHeader>
        <ModalBody>
          <p>Are you sure you want to cancel this appointment?</p>
          <p className="text-muted small">
            <i className="ri-information-line me-1"></i>
            Note: Appointments can only be cancelled with at least 1-hour notice.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setCancelModal(false)}>
            No, Keep It
          </Button>
          <Button color="danger" onClick={handleCancelConfirm}>
            Yes, Cancel Appointment
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default MyAppointments; 
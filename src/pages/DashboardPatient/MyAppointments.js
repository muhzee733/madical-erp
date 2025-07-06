import React, { useState, useCallback } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Spinner,
  Alert,
  Badge,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  getMyAppointments,
  rescheduleAppointment,
  cancelAppointment,
} from "../../slices/PatientAppointment/thunk";
import { PostChatRooms } from '../../slices/chat/thunk';
import Swal from 'sweetalert2';

const MyAppointments = React.memo(
  ({ appointments, loading, error, onReschedule, onCancel }) => {
    const dispatch = useDispatch();
    const [cancelModal, setCancelModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [chatLoading, setChatLoading] = useState(null);

    const getStatusBadge = useCallback((status) => {
      switch (status) {
        case "booked":
          return <Badge color="success">Booked</Badge>;
        case "completed":
          return <Badge color="secondary">Completed</Badge>;
        case "cancelled":
          return <Badge color="danger">Cancelled</Badge>;
        case "rescheduled":
          return <Badge color="warning">Rescheduled</Badge>;
        default:
          return <Badge color="info">{status}</Badge>;
      }
    }, []);

    const handleCancelClick = useCallback((appointment) => {
      setSelectedAppointment(appointment);
      setCancelModal(true);
    }, []);

    const handleCancelConfirm = useCallback(async () => {
      if (selectedAppointment) {
        try {
          await onCancel(selectedAppointment.id);
          setCancelModal(false);
          setSelectedAppointment(null);
          // Refresh appointments list
          dispatch(getMyAppointments());
        } catch (error) {
          console.error("Failed to cancel appointment:", error);
        }
      }
    }, [selectedAppointment, onCancel, dispatch]);

    const handleChatClick = async (payload) => {
      if (!payload.patient || !payload.doctor || !payload.appointment) {
        Swal.fire('Error!', 'Missing patient, doctor, or appointment ID.', 'error');
        return;
      }
      setChatLoading(payload.appointment);
      const response = await dispatch(PostChatRooms(payload));
      setChatLoading(null);
      console.log(response, 'response')
      if (response?.data?.existing_room_id) {
        // Redirect to the existing chat room
        window.location.href = `/chatroom?room=${response.data.existing_room_id}`;
      } else if (response?.status === 201 && response?.data?.id) {
        Swal.fire({
          title: 'Success!',
          text: 'New chat room created',
          icon: 'success',
        }).then(() => {
          window.location.href = `/chatroom?room=${response.data.id}`;
        });
      } else {
        Swal.fire('Error!', response?.data?.detail || 'Failed to create or find chat room.', 'error');
      }
    };

    return (
      <div className="my-appointments">
        <Card>
          <CardHeader className="d-flex justify-content-between align-items-center">
            <h4 className="card-title mb-0">My Appointments</h4>
          </CardHeader>
          <CardBody>
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Patient</th>
                    <th>Appointment Time</th>
                    <th>Booked At</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        <Spinner color="primary" size="sm" className="me-2" />
                        <span>Loading appointments...</span>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="7">
                        <Alert color="danger" className="mb-0">
                          <i className="ri-error-warning-line me-2"></i>
                          {error}
                        </Alert>
                      </td>
                    </tr>
                  ) : !appointments?.results ||
                    appointments.results.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        <i className="ri-calendar-line display-4 mb-3 text-muted"></i>
                        <p className="text-muted mb-0">No appointments found</p>
                      </td>
                    </tr>
                  ) : (
                    appointments.results.map((appointment, index) => (
                      <tr
                        key={appointment.id}
                        className={
                          appointment.status === "rescheduled"
                            ? "text-muted"
                            : ""
                        }
                        style={{
                          opacity:
                            appointment.status === "rescheduled" ? 0.6 : 1,
                          pointerEvents:
                            appointment.status === "rescheduled"
                              ? "none"
                              : "auto",
                        }}
                      >
                        <td>{index + 1}</td>
                        <td>
                          <h6 className="mb-0">
                            {appointment.patient.first_name}{" "}
                            {appointment.patient.last_name}
                          </h6>
                          <small className="text-muted">
                            {appointment.patient.email}
                          </small>
                        </td>
                        <td>
                          {(() => {
                            const startDate = new Date(
                              appointment.availability.start_time
                            );
                            const endDate = new Date(
                              appointment.availability.end_time
                            );

                            const optionsFull = {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                              timeZone: "Australia/Brisbane",
                            };

                            const optionsTimeOnly = {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                              timeZone: "Australia/Brisbane",
                            };

                            return (
                              <>
                                {startDate.toLocaleString("en-US", optionsFull)}
                                <br />
                                <small className="text-muted">
                                  to{" "}
                                  {endDate.toLocaleString(
                                    "en-US",
                                    optionsTimeOnly
                                  )}
                                </small>
                              </>
                            );
                          })()}
                        </td>
                        <td>
                          {(() => {
                            const bookedDate = new Date(appointment.booked_at);
                            return bookedDate.toLocaleString("en-US", {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            });
                          })()}
                        </td>
                        <td>${appointment.price || 0}</td>
                        <td>{getStatusBadge(appointment.status)}</td>
                        <td>
                          <div className="d-flex gap-2">
                            {["cancelled_by_patient"].includes(
                              appointment.status
                            ) ? (
                              <>
                                <Button color="warning" size="sm" disabled>
                                  <i className="ri-calendar-event-line me-1"></i>
                                  Reschedule
                                </Button>
                                <Button color="danger" size="sm" disabled>
                                  <i className="ri-close-circle-line me-1"></i>
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  color="warning"
                                  size="sm"
                                  onClick={() => onReschedule(appointment.id)}
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
                                {appointment.status === "booked" && (
                                  <Button
                                    color="info"
                                    size="sm"
                                    disabled={chatLoading === appointment.id}
                                    onClick={() => handleChatClick({
                                      patient: appointment.patient.id,
                                      doctor: appointment.availability.doctor.id,
                                      appointment: appointment.id,
                                    })}
                                  >
                                    {chatLoading === appointment.id ? (
                                      <Spinner size="sm" className="me-1" />
                                    ) : (
                                      <i className="ri-chat-1-line me-1"></i>
                                    )}
                                    Chat
                                  </Button>
                                )}
                              </>
                            )}

                            {/* {appointment.status === "" && (
                              <>
                                <Button
                                  color="warning"
                                  size="sm"
                                  onClick={() => onReschedule(appointment.id)}
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
                            )} */}
                            {appointment.rescheduled_from && (
                              <Badge color="info">
                                <i className="ri-history-line me-1"></i>
                                Rescheduled
                              </Badge>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
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
              Note: Appointments can only be cancelled with at least 1-hour
              notice.
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
  }
);

MyAppointments.displayName = "MyAppointments";

export default MyAppointments;

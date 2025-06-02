import React, { useEffect } from 'react';
import { Card, CardBody, CardHeader, Spinner, Alert, Badge } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getPatientAppointments } from '../../slices/PatientAppointment/thunk';

const AllAppointments = () => {
  const dispatch = useDispatch();
  const { myAppointments, loading, error } = useSelector(
    (state) => state.patientAppointment
  );

  useEffect(() => {
    dispatch(getPatientAppointments());
  }, [dispatch]);

  const getStatusBadge = (startTime) => {
    const now = new Date();
    const appointmentTime = new Date(startTime);
    
    if (appointmentTime < now) {
      return <Badge color="secondary">Completed</Badge>;
    } else if (appointmentTime - now < 24 * 60 * 60 * 1000) { // Less than 24 hours
      return <Badge color="warning">Upcoming</Badge>;
    } else {
      return <Badge color="success">Scheduled</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner color="primary" />
        <span className="ms-2">Loading appointments...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert color="danger">
        <i className="ri-error-warning-line me-2"></i>
        {error}
      </Alert>
    );
  }

  return (
    <div className="all-appointments">
      <Card>
        <CardHeader className="d-flex justify-content-between align-items-center">
          <h4 className="card-title mb-0">All Appointments</h4>
        </CardHeader>
        <CardBody>
          {myAppointments.length === 0 ? (
            <div className="text-center text-muted">
              <i className="ri-calendar-line display-4 mb-3"></i>
              <p>No appointments found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Doctor</th>
                    <th>Patient</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Type</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myAppointments?.map((appointment) => (
                    <tr key={appointment.id}>
                      <td>
                        <h6 className="mb-0">Dr. {appointment.doctor}</h6>
                      </td>
                      <td>
                        <h6 className="mb-0">{appointment.patient}</h6>
                      </td>
                      <td>
                        {new Date(appointment.start_time).toLocaleDateString(undefined, {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td>
                        {new Date(appointment.start_time).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })} - {new Date(appointment.end_time).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td>
                        <Badge color="info">{appointment.slot_type}</Badge>
                      </td>
                      <td>
                        {getStatusBadge(appointment.start_time)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default AllAppointments; 
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardBody, Button, Spinner } from "reactstrap";
import axios from "axios";

const AppointmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/appointments/details/${id}/`);
        setAppointmentDetails(response.appointment);
        setError(null);
      } catch (err) {
        setError(err.response?.message || "Failed to fetch appointment details");
        setAppointmentDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentDetails();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (time) => {
    if (!time) return "";
    const [hour, minute] = time.split(":");
    return `${hour}:${minute}`;
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-5">
        <h5 className="text-danger">Error: {error}</h5>
        <Button color="primary" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  if (!appointmentDetails) {
    return (
      <div className="text-center py-5">
        <h5>Appointment not found</h5>
        <Button color="primary" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <Card>
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="card-title mb-0">Appointment Details</h4>
                  <Button color="primary" onClick={() => navigate(-1)}>
                    Back to List
                  </Button>
                </div>

                <div className="table-responsive">
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <th style={{ width: "200px" }}>Appointment ID</th>
                        <td>{appointmentDetails.id}</td>
                      </tr>
                      <tr>
                        <th>Doctor Name</th>
                        <td>{`${appointmentDetails.doctor.first_name} ${appointmentDetails.doctor.last_name}`}</td>
                      </tr>
                      <tr>
                        <th>Doctor Email</th>
                        <td>{appointmentDetails.doctor.email}</td>
                      </tr>
                      <tr>
                        <th>Date</th>
                        <td>{formatDate(appointmentDetails.date)}</td>
                      </tr>
                      <tr>
                        <th>Time</th>
                        <td>{`${formatTime(appointmentDetails.start_time)} - ${formatTime(appointmentDetails.end_time)}`}</td>
                      </tr>
                      <tr>
                        <th>Status</th>
                        <td>
                          <span className={`badge bg-${getStatusColor(appointmentDetails.order.status)}`}>
                            {appointmentDetails.order.status}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <th>Price</th>
                        <td>${appointmentDetails.price}</td>
                      </tr>
                      <tr>
                        <th>Order ID</th>
                        <td>{appointmentDetails.order.id}</td>
                      </tr>
                      <tr>
                        <th>Payment Status</th>
                        <td>
                          <span className={`badge bg-${getPaymentStatusColor(appointmentDetails.order.status)}`}>
                            {appointmentDetails.order.status}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <th>Created At</th>
                        <td>{new Date(appointmentDetails.created_at).toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-3">
                  <Button color="success" className="me-2">
                    Confirm Appointment
                  </Button>
                  <Button color="danger">
                    Cancel Appointment
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "warning";
    case "paid":
      return "success";
    case "cancelled":
      return "danger";
    default:
      return "secondary";
  }
};

const getPaymentStatusColor = (status) => {
  switch (status) {
    case "paid":
      return "success";
    case "pending":
      return "warning";
    case "failed":
      return "danger";
    default:
      return "secondary";
  }
};

export default AppointmentDetails; 
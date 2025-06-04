import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardBody,
  Button,
  Container,
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionBody,
  Spinner,
  Alert,
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { useDispatch, useSelector } from "react-redux";
import { getAppointmentById } from "../../slices/appointments/thunk";
import { clearSelectedAppointment } from "../../slices/appointments/reducer";

const AppointmentDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [open, setOpen] = useState("");

  const { selectedAppointment, loading, error } = useSelector((state) => state.Appointment);

  useEffect(() => {
    if (id) {
      dispatch(getAppointmentById(id));
    }
    return () => {
      dispatch(clearSelectedAppointment());
    };
  }, [dispatch, id]);

  const toggle = (id) => {
    open === id ? setOpen("") : setOpen(id);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (time) => {
    if (!time) return "";
    const date = new Date(time);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "booked":
        return "success";
      case "cancelled_by_patient":
      case "cancelled_by_doctor":
        return "danger";
      case "completed":
        return "secondary";
      default:
        return "info";
    }
  };

  if (loading) {
    return (
      <div className="page-content">
        <Container fluid>
          <div className="text-center py-5">
            <Spinner color="primary" />
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content">
        <Container fluid>
          <Alert color="danger">
            Error: {error}
          </Alert>
        </Container>
      </div>
    );
  }

  if (!selectedAppointment) {
    return (
      <div className="page-content">
        <Container fluid>
          <Alert color="warning">
            No appointment details found
          </Alert>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Appointment Details" pageTitle="Dashboard" />
        <div className="row">
          <div className="col-12">
            <Card>
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="card-title mb-0">Appointment Details</h4>
                  <div>
                    <Button color="success" className="me-2" onClick={() => navigate(`/chat/${selectedAppointment.id}`)}>
                      Go for Chat
                    </Button>
                    <Button color="primary" onClick={() => navigate(-1)}>
                      Back to List
                    </Button>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <th style={{ width: "200px" }}>Appointment ID</th>
                        <td>{selectedAppointment.id}</td>
                      </tr>
                      <tr>
                        <th>Patient Name</th>
                        <td>
                          {selectedAppointment.patient.first_name}{" "}
                          {selectedAppointment.patient.last_name}
                        </td>
                      </tr>
                      <tr>
                        <th>Patient Email</th>
                        <td>{selectedAppointment.patient.email}</td>
                      </tr>
                      <tr>
                        <th>Patient Phone</th>
                        <td>{selectedAppointment.patient.phone_number}</td>
                      </tr>
                      <tr>
                        <th>Doctor Name</th>
                        <td>
                          {selectedAppointment.availability?.doctor?.first_name}{" "}
                          {selectedAppointment.availability?.doctor?.last_name}
                        </td>
                      </tr>
                      <tr>
                        <th>Doctor Email</th>
                        <td>{selectedAppointment.availability?.doctor?.email}</td>
                      </tr>
                      <tr>
                        <th>Appointment Time</th>
                        <td>
                          {formatDate(selectedAppointment.availability?.start_time)} at{" "}
                          {formatTime(selectedAppointment.availability?.start_time)} -{" "}
                          {formatTime(selectedAppointment.availability?.end_time)}
                        </td>
                      </tr>
                      <tr>
                        <th>Slot Type</th>
                        <td className="text-capitalize">{selectedAppointment.availability?.slot_type}</td>
                      </tr>
                      <tr>
                        <th>Timezone</th>
                        <td>{selectedAppointment.availability?.timezone}</td>
                      </tr>
                      <tr>
                        <th>Created At</th>
                        <td>{formatDate(selectedAppointment.availability?.created_at)}</td>
                      </tr>
                      <tr>
                        <th>Status</th>
                        <td>
                          <span className={`badge bg-${getStatusColor(selectedAppointment.status)}`}>
                            {selectedAppointment.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <th>Booked At</th>
                        <td>{formatDate(selectedAppointment.booked_at)}</td>
                      </tr>
                      {selectedAppointment.note && (
                        <tr>
                          <th>Note</th>
                          <td>{selectedAppointment.note}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Keep the Q&A Accordion */}
                <div className="mt-4">
                  <h5 className="mb-3">Frequently Asked Questions</h5>
                  <Accordion open={open} toggle={toggle}>
                    <AccordionItem>
                      <AccordionHeader targetId="1">
                        Do I need to bring any medical documents?
                      </AccordionHeader>
                      <AccordionBody accordionId="1">
                        Yes, please bring your previous prescriptions and reports.
                      </AccordionBody>
                    </AccordionItem>
                    <AccordionItem>
                      <AccordionHeader targetId="2">
                        Can I reschedule the appointment?
                      </AccordionHeader>
                      <AccordionBody accordionId="2">
                        Yes, contact the clinic 24 hours before the scheduled time.
                      </AccordionBody>
                    </AccordionItem>
                  </Accordion>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AppointmentDetails;

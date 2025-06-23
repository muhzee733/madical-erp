import React, { useEffect, useState, useMemo } from "react";
import {
  Button,
  Row,
  Col,
  Container,
  Card,
  CardBody,
  Alert,
  Table,
} from "reactstrap";
import Swal from "sweetalert2";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import DoctorAuthWrapper from "../../Routes/DoctorAuthWrapper";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Cookies from "js-cookie";

// FullCalendar Imports
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const Appointment = () => {
  const dispatch = useDispatch();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const [paginatedSchedules, setPaginatedSchedules] = useState([]);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    currentPage: 1,
  });

  document.title = "Appointment | ProMedicine";

  const deleteAvailability = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This slot will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/appointments/availabilities/${id}/delete/`
        );
        fetchPaginatedSchedules();
        Swal.fire("Deleted!", "The availability slot has been removed.", "success");
      } catch (error) {
        Swal.fire("Error!", "Failed to delete the slot.", "error");
      }
    }
  };

  const handleDateClick = (info) => {
    const clickedDate = new Date(info.dateStr);
    clickedDate.setHours(0, 0, 0, 0);
    if (clickedDate < today) return;
    setSelectedDate(info.dateStr);
  };

  const getDayClassNames = (arg) => {
    const date = new Date(arg.date);
    date.setHours(0, 0, 0, 0);
    return date < today ? "fc-day-disabled" : "";
  };

  const generateTimeSlots = () => {
    const slots = [];
    if (!selectedDate) return slots;

    for (let h = 8; h <= 20; h++) {
      for (let m = 0; m < 60; m += 15) {
        const hour = h.toString().padStart(2, "0");
        const minute = m.toString().padStart(2, "0");
        const timeStr = `${hour}:${minute}`;
        const ampm = h < 12 ? "AM" : "PM";
        slots.push({ time: timeStr, label: `${timeStr} ${ampm}` });
      }
    }
    return slots;
  };

  const handleSlotClick = (slot) => {
    setSelectedSlots((prevSlots) => {
      if (prevSlots.some((s) => s.time === slot.time)) {
        return prevSlots.filter((s) => s.time !== slot.time);
      }
      const endTime = getEndTime(slot.time);
      return [...prevSlots, { ...slot, end_time: endTime }];
    });
  };

  const getEndTime = (startTime) => {
    const [hour, minute] = startTime.split(":").map(Number);
    let endMinute = minute + 15;
    let endHour = hour;

    if (endMinute === 60) {
      endMinute = 0;
      endHour += 1;
    }

    const formattedEndMinute = endMinute.toString().padStart(2, "0");
    const formattedEndHour = endHour.toString().padStart(2, "0");

    return `${formattedEndHour}:${formattedEndMinute}`;
  };

  const timeSlots = useMemo(() => generateTimeSlots(), [selectedDate]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessages([]);

    if (selectedSlots.length === 0) {
      setErrorMessages(["Please select at least one time slot."]);
      setIsSubmitting(false);
      return;
    }

    const payload = {
      date: selectedDate,
      start_times: selectedSlots.map((slot) => slot.time),
      slot_type: "short",
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/appointments/availabilities/custom/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response) {
        setSuccessMessage("Schedule created successfully.");
        setSelectedSlots([]);
        fetchPaginatedSchedules();
      }
    } catch (error) {
      setErrorMessages([
        error.response?.message || "Something went wrong while submitting.",
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPageFromUrl = (url) => {
    const params = new URLSearchParams(url?.split("?")[1]);
    return parseInt(params.get("page") || 1, 10);
  };

  const fetchPaginatedSchedules = async (url = null) => {
    setLoading(true);
    try {
      const endpoint =
        url ||
        `${process.env.REACT_APP_API_URL}/appointments/availabilities/list/?page=${pagination.currentPage}`;
      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res, 'res')
      setPaginatedSchedules(res.data.results);
      setPagination({
        count: res.data.count,
        next: res.data.next,
        previous: res.data.previous,
        currentPage: getPageFromUrl(endpoint),
      });
    } catch (error) {
      console.error("Pagination fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    setSelectedDate(todayStr);

    const userCookie = Cookies.get("user");
    if (userCookie) setUser(JSON.parse(userCookie));
    setToken(Cookies.get("authUser"));

    fetchPaginatedSchedules();
  }, []);

  return (
    <div className="page-content">
      <DoctorAuthWrapper>
        <Container fluid>
          <BreadCrumb title="Schedule Time" pageTitle="Pages" />

          <Row className="mt-4">
            <Col md={6}>
              <Card>
                <CardBody>
                  <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    selectable={true}
                    dateClick={handleDateClick}
                    dayCellClassNames={getDayClassNames}
                    height="auto"
                    weekends={false}
                    initialDate={selectedDate}
                  />
                </CardBody>
              </Card>
            </Col>
            <Col md={6}>
              {selectedDate && (
                <Card className="mt-4">
                  <CardBody>
                    {successMessage && (
                      <Alert
                        color="success"
                        toggle={() => setSuccessMessage("")}
                      >
                        {successMessage}
                      </Alert>
                    )}
                    {errorMessages.length > 0 && (
                      <Alert color="danger" toggle={() => setErrorMessages([])}>
                        <ul className="mb-0">
                          {errorMessages.map((err, i) => (
                            <li key={i}>{err}</li>
                          ))}
                        </ul>
                      </Alert>
                    )}
                    <h5 className="mb-4">
                      Select Time Slot for <strong>{selectedDate}</strong>
                    </h5>
                    <div className="d-flex flex-wrap gap-2">
                      {timeSlots.map((slot, idx) => (
                        <Button
                          key={idx}
                          color={
                            selectedSlots.some((s) => s.time === slot.time)
                              ? "primary"
                              : "light"
                          }
                          onClick={() => handleSlotClick(slot)}
                        >
                          {slot.label}
                        </Button>
                      ))}
                    </div>
                    <Button
                      color="success"
                      className="mt-3"
                      onClick={handleSubmit}
                      disabled={selectedSlots.length === 0 || isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Schedule"}
                    </Button>
                  </CardBody>
                </Card>
              )}
            </Col>
          </Row>

          <Row className="mt-4">
            <Col>
              <Card>
                <CardBody>
                  <h5 className="mb-3">All Appointments</h5>
                  {loading ? (
                    <div className="text-center my-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="table-responsive">
                        <Table className="table-bordered align-middle mb-0">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Created At</th>
                              <th>Start Time</th>
                              <th>End Time</th>
                              <th>Slot Type</th>
                              <th>Booked</th>
                              <th>Timezone</th>
                              <th>Delete</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedSchedules.length > 0 ? (
                              paginatedSchedules.map((slot, index) => (
                                <tr key={slot.id}>
                                  <td>
                                    {index + 1 + (pagination.currentPage - 1) * 10}
                                  </td>
                                  <td>{new Date(slot.created_at).toLocaleString()}</td>
                                  <td>{new Date(slot.start_time).toLocaleString()}</td>
                                  <td>{new Date(slot.end_time).toLocaleString()}</td>
                                  <td className="text-capitalize">{slot.slot_type}</td>
                                  <td>
                                    {slot.is_booked ? (
                                      <span className="badge bg-danger">Booked</span>
                                    ) : (
                                      <span className="badge bg-success">Available</span>
                                    )}
                                  </td>
                                  <td>{slot.timezone}</td>
                                  <td>
                                    <button
                                      onClick={() => deleteAvailability(slot.id)}
                                      disabled={slot.is_booked}
                                      className="bg-danger border-0 text-white px-3 py-1 rounded"
                                    >
                                      Delete
                                    </button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="8" className="text-center">
                                  No appointments found.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </div>

                      <div className="d-flex justify-content-end mt-3">
                        <Button
                          color="secondary"
                          onClick={() => fetchPaginatedSchedules(pagination.previous)}
                          disabled={!pagination.previous}
                        >
                          Previous
                        </Button>
                        <span className="mx-2 align-self-center">
                          Page {pagination.currentPage}
                        </span>
                        <Button
                          color="secondary"
                          onClick={() => fetchPaginatedSchedules(pagination.next)}
                          disabled={!pagination.next}
                        >
                          Next
                        </Button>
                      </div>
                    </>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </DoctorAuthWrapper>

      <style>
        {`
          .fc-day-disabled {
            background-color: #f0f0f0 !important;
            pointer-events: none;
            opacity: 0.6;
          }
        `}
      </style>
    </div>
  );
};

export default Appointment;

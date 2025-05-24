import React, { useEffect, useState } from "react";
import { Button, Row, Col, Container, Card, CardBody, Alert } from "reactstrap";
import { useNavigate } from "react-router-dom";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import DoctorAuthWrapper from "../../Routes/DoctorAuthWrapper";
import AppointmentTable from "../../Components/Common/AppointmentTable";
import { useSelector, useDispatch } from "react-redux";
import { getOrders } from "../../slices/OrderAppointment/thunk";
import axios from "axios";
import Cookies from "js-cookie";
import { useMemo } from "react";

// FullCalendar Imports
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const Appointment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  document.title = "Appointment | Velzon - React Admin & Dashboard Template";

  useEffect(() => {
    dispatch(getOrders());
    setLoading(false);
    const userCookie = Cookies.get("user");
    if (userCookie) {
      setUser(JSON.parse(userCookie));
    }
    setToken(Cookies.get("authUser"));
  }, [dispatch]);

  const {
    orders,
    loading: ordersLoading,
    error: ordersError,
  } = useSelector((state) => state.OrderAppointment);

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
    const now = new Date();
    now.setSeconds(0);
    now.setMilliseconds(0);

    const selected = selectedDate ? new Date(selectedDate) : null;
    if (selected) selected.setHours(0, 0, 0, 0);

    for (let h = 8; h <= 20; h++) {
      for (let m = 0; m < 60; m += 15) {
        const hour = h.toString().padStart(2, "0");
        const minute = m.toString().padStart(2, "0");
        const timeStr = `${hour}:${minute}`;
        const ampm = h < 12 ? "AM" : "PM";

        const slotTime = new Date(selectedDate || now);
        slotTime.setHours(h, m, 0, 0);

        if (selected) {
          if (selected.getTime() === today.getTime()) {
            if (slotTime > now) {
              slots.push({ time: timeStr, label: `${timeStr} ${ampm}` });
            }
          } else if (selected > today) {
            slots.push({ time: timeStr, label: `${timeStr} ${ampm}` });
          }
        }
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

    const payload = selectedSlots.map((slot) => ({
      date: selectedDate,
      start_time: slot.time,
    }));
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/appointments/availabilities/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { created, errors } = response;

      if (created) {
        setSuccessMessage(`${response.message}`);
        setSelectedSlots([]);
      } else if (created === false) {
        setSuccessMessage(`${response.message}`);
        setSelectedSlots([]);
      }

      if (errors && errors.length > 0) {
        const formattedErrors = errors.map((e, i) =>
          typeof e === "string" ? e : JSON.stringify(e)
        );
        setErrorMessages(formattedErrors);
      }
    } catch (error) {
      setErrorMessages(["Something went wrong while submitting."]);
      console.error("Error creating schedule:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-content">
      <DoctorAuthWrapper>
        <Container fluid>
          <BreadCrumb title="Appointment" pageTitle="Pages" />

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
        </Container>
      </DoctorAuthWrapper>

      {/* Style for disabled days */}
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

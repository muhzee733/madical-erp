import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, CardBody, Button } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import axios from "axios";
import { Alert } from "reactstrap";
import Cookies from "js-cookie";
import { useMemo } from "react";

// FullCalendar Imports
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const ScheduleAppointment = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      setUser(JSON.parse(userCookie));
    }
    setToken(Cookies.get("authUser"));
  }, []);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

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
            // If selected date is today → only future slots
            if (slotTime > now) {
              slots.push({ time: timeStr, label: `${timeStr} ${ampm}` });
            }
          } else if (selected > today) {
            // Future dates → all slots
            slots.push({ time: timeStr, label: `${timeStr} ${ampm}` });
          }
        }
      }
    }
    return slots;
  };

  const handleSlotClick = (slot) => {
    setSelectedSlots((prevSlots) => {
      // Add or remove the selected slot
      if (prevSlots.some((s) => s.time === slot.time)) {
        return prevSlots.filter((s) => s.time !== slot.time);
      }

      // Calculate end time based on 15-minute intervals
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
      }else if(created == false){
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
      <Container fluid>
        <BreadCrumb title="Schedule Appointments" pageTitle="Pages" />
        <Row>
          <Col lg={6}>
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

          {selectedDate && (
            <Col lg={6}>
              <Card>
                <CardBody>
                  {successMessage && (
                    <Alert color="success" toggle={() => setSuccessMessage("")}>
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
                </CardBody>
                <Button
                  color="success"
                  className="mt-3"
                  onClick={handleSubmit}
                  disabled={selectedSlots.length === 0 || isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Schedule"}
                </Button>
              </Card>
            </Col>
          )}
        </Row>
      </Container>

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

export default ScheduleAppointment;

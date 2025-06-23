import React from "react";
import { Card, CardBody, CardHeader, Spinner, Button, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import { useState } from "react";

const MiniAppointment = ({ doctor, appointments, onBookSlot, loading }) => {
  const [activeTab, setActiveTab] = useState("1");

  // Group appointments by date
  const appointmentsByDate = appointments?.results?.reduce((acc, slot) => {
    const date = new Date(slot.start_time).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(slot);
    return acc;
  }, {}) || {};


  const dates = Object.keys(appointmentsByDate).sort((a, b) => new Date(a) - new Date(b));

  return (
    <Card className="mb-4">
      <CardHeader className="d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">
          Dr. {doctor.name}
        </h5>
      </CardHeader>
      <CardBody>
        {loading ? (
          <div className="text-center">
            <Spinner color="primary" />
            <span className="ms-2">Loading appointments...</span>
          </div>
        ) : dates.length === 0 ? (
          <div className="text-center text-muted">
            <i className="ri-calendar-line display-4 mb-3"></i>
            <p>No available time slots for this doctor</p>
            <p className="small">Debug info: {JSON.stringify({ appointmentsCount: appointments?.results?.length, datesCount: dates.length })}</p>
          </div>
        ) : (
          <>
            <Nav tabs className="nav-tabs-custom">
              {dates.map((date, index) => (
                <NavItem key={date}>
                  <NavLink
                    className={activeTab === (index + 1).toString() ? "active" : ""}
                    onClick={() => setActiveTab((index + 1).toString())}
                  >
                    {new Date(date).toLocaleDateString(undefined, {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </NavLink>
                </NavItem>
              ))}
            </Nav>
            <TabContent activeTab={activeTab} className="p-3">
              {dates.map((date, index) => (
                <TabPane key={date} tabId={(index + 1).toString()}>
                  <div className="d-flex flex-wrap gap-2">
                    {appointmentsByDate[date].map((slot) => (
                      <Button
                        key={slot.id}
                        color="outline-primary"
                        onClick={() => onBookSlot(slot)}
                      >
                        {new Date(slot.start_time).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Button>
                    ))}
                  </div>
                </TabPane>
              ))}
            </TabContent>
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default MiniAppointment;
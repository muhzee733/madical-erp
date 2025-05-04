import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAppointments } from "../../slices/appointments/thunk";
import { addAppointmentToCart } from "../../slices/cart/thunk";
import { getOrders } from "../../slices/OrderAppointment/thunk";
import classnames from "classnames";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  CardTitle,
  Row,
  Col,
  Button,
  Spinner,
  ListGroup,
  ListGroupItem,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import AppointmentTable from "../../Components/Common/AppointmentTable";

const MiniAppointment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { appointments = [], error } = useSelector(
    (state) => state.Appointment || {}
  );
  const { items: cartItems } = useSelector((state) => state.Cart || {});
  const {
    orders,
    loading: ordersLoading,
    error: ordersError,
  } = useSelector((state) => state.OrderAppointment);

  const [loading, setLoading] = useState(true);
  const [loadingAppointmentId, setLoadingAppointmentId] = useState(null);
  const [activeDateTab, setActiveDateTab] = useState({});

  const days = useMemo(
    () => ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    []
  );

  useEffect(() => {
    dispatch(getAppointments());
    dispatch(getOrders());
    setLoading(false);
  }, [dispatch]);

  const handleAddToCart = (appointment) => {
    setLoadingAppointmentId(appointment.id);
    dispatch(addAppointmentToCart(appointment));
    setLoadingAppointmentId(null);
  };

  useEffect(() => {
    if (appointments?.doctors?.length) {
      const newActiveTabs = {};

      appointments.doctors.forEach((doctor) => {
        const dates = [...new Set(doctor.appointments.map((a) => a.date))];
        newActiveTabs[doctor.id] = dates[0];
      });

      setActiveDateTab(newActiveTabs);
    }
  }, [appointments]);

  const isInCart = useCallback(
    (appointmentId) => cartItems.some((item) => item.id === appointmentId),
    [cartItems]
  );

  const toggleDateTab = (doctorId, date) => {
    setActiveDateTab((prev) => ({
      ...prev,
      [doctorId]: date,
    }));
  };

  if (loading) {
    return (
      <Col sm="12" className="text-center">
        <Spinner color="primary" />
      </Col>
    );
  }

  if (error) {
    return (
      <Col sm="12">
        <Card>
          <CardBody>
            <CardTitle tag="h5">Error</CardTitle>
            <CardText>{error}</CardText>
          </CardBody>
        </Card>
      </Col>
    );
  }

  return (
    <div>
      <Row>
        {appointments?.doctors?.map((doctor) => {
          const uniqueDates = [
            ...new Set(doctor.appointments.map((a) => a.date)),
          ];

          return (
            <Col sm="12" key={doctor.id}>
              <Card>
                <CardBody>
                  <CardTitle tag="h4" className="mb-4">
                    <span>Book Your Appointment</span> <strong>(15 Min)</strong>
                    <h6 className="mt-2">
                      Doctor: {doctor.first_name} {doctor.last_name}
                    </h6>
                  </CardTitle>

                  {/* Tabs for Dates */}
                  <Nav tabs className="nav-tabs-custom mb-3">
                    {uniqueDates.length > 0 ? (
                      uniqueDates.map((date, idx) => (
                        <NavItem key={idx}>
                          <NavLink
                            href="#"
                            className={classnames({
                              active: activeDateTab[doctor.id] === date,
                            })}
                            onClick={() => toggleDateTab(doctor.id, date)}
                          >
                            {dayjs(date).format("ddd, DD MMM")}
                          </NavLink>
                        </NavItem>
                      ))
                    ) : (
                      <Col sm="12" className="text-center">
                        <CardText>No time schedule available</CardText>
                      </Col>
                    )}
                  </Nav>

                  {/* Appointment Times */}
                  {uniqueDates.length > 0 ? (
                    <TabContent
                      activeTab={activeDateTab[doctor.id] || uniqueDates[0]}
                      className="pt-3"
                    >
                      {uniqueDates.map((date) => (
                        <TabPane tabId={date} key={date}>
                          <Row className="gy-3">
                            {doctor.appointments
                              .filter(
                                (appointment) =>
                                  appointment.date === date &&
                                  !appointment.is_booked
                              )
                              .map((appointment) => (
                                <Col md={4} key={appointment.id}>
                                  <div className="border p-3 text-center rounded">
                                    <h6 className="mb-1">
                                      {appointment.start_time.slice(0, 5)}
                                    </h6>
                                    {isInCart(appointment.id) ? (
                                      <Button
                                        color="success"
                                        onClick={() =>
                                          navigate("/checkout", {
                                            state: {
                                              appointmentId: appointment.id,
                                            },
                                          })
                                        }
                                        size="sm"
                                        className="mt-2"
                                      >
                                        Go to Checkout
                                      </Button>
                                    ) : (
                                      <Button
                                        color="primary"
                                        onClick={() =>
                                          handleAddToCart(appointment)
                                        }
                                        size="sm"
                                        className="mt-2"
                                      >
                                        {loadingAppointmentId ===
                                        appointment.id ? (
                                          <Spinner size="sm" />
                                        ) : (
                                          "Book Now"
                                        )}
                                      </Button>
                                    )}
                                  </div>
                                </Col>
                              ))}
                          </Row>
                        </TabPane>
                      ))}
                    </TabContent>
                  ) : null}
                </CardBody>
              </Card>
            </Col>
          );
        })}
      </Row>
      <Row>
        <Col md="8">
          <AppointmentTable
            orders={orders}
            loading={ordersLoading}
            error={ordersError}
          />
        </Col>
        <Col sm="4">
          <Card>
            <CardBody>
              <CardTitle tag="h5">
                <strong>Weekly Timing</strong>
              </CardTitle>
              <ListGroup>
                {days.map((day, idx) => (
                  <ListGroupItem
                    key={idx}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div className="d-flex">
                      <i className="ri-bill-line align-middle me-2"></i>
                      <h6>{day}</h6>
                    </div>
                    <span className="badge bg-success">8:00 AM - 8:00 PM</span>
                  </ListGroupItem>
                ))}
              </ListGroup>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MiniAppointment;
